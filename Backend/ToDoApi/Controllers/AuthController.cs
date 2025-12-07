using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ToDoApi.DTOs;
using ToDoApi.Models;

namespace ToDoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly string cadenaConexion;
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
            cadenaConexion = config.GetConnectionString("CadenaSQL");
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] RegistroDTO modelo)
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(modelo.Password, 12);

            using (var conexion = new SqlConnection(cadenaConexion))
            {
                await conexion.OpenAsync();

                string query = "INSERT INTO Usuarios (Nombre, Correo, PasswordHash) VALUES (@Nombre, @Correo, @PassHash)";

                using (var comando = new SqlCommand(query, conexion))
                {
                    comando.Parameters.AddWithValue("@Nombre", modelo.Nombre);
                    comando.Parameters.AddWithValue("@Correo", modelo.Correo);
                    comando.Parameters.AddWithValue("@PassHash", passwordHash);

                    try
                    {
                        await comando.ExecuteNonQueryAsync();
                    }
                    catch (SqlException ex)
                    {
                        if (ex.Number == 2627) return BadRequest("El correo ya esta registrado.");
                        return StatusCode(500, ex.Message);
                    }
                }
            }

            return Ok(new { mensaje = "Usuario registrado con éxito" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO modelo)
        {
            Usuario usuarioEncontrado = null;

            using (var conexion = new SqlConnection(cadenaConexion)) 
            {
                await conexion.OpenAsync();
                string query = "SELECT * FROM Usuarios WHERE Correo = @Correo";

                using (var comando = new SqlCommand(query, conexion))
                {
                    comando.Parameters.AddWithValue("@Correo", modelo.Correo);

                    using (var lector = await comando.ExecuteReaderAsync())
                    {
                        if (await lector.ReadAsync())
                        {
                            usuarioEncontrado = new Usuario
                            {
                                Id = Convert.ToInt32(lector["Id"]),
                                Nombre = lector["Nombre"].ToString(),
                                Correo = lector["Correo"].ToString(),
                                PasswordHash = lector["PasswordHash"].ToString()
                            };
                        }
                    }
                }
            }

            if (usuarioEncontrado == null) return Unauthorized("Correo no registrado.");

            bool passwordCorrecta = BCrypt.Net.BCrypt.Verify(modelo.Password, usuarioEncontrado.PasswordHash);

            if (!passwordCorrecta) return Unauthorized("Contraseña incorrecta.");

            string token = GenerarToken(usuarioEncontrado);

            return Ok(new { token = token });
        }

        private string GenerarToken(Usuario usuario)
        {
            var key = _config.GetValue<string>("Jwt:Key");
            var keyBytes = Encoding.ASCII.GetBytes(key);

            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()));
            claims.AddClaim(new Claim(ClaimTypes.Email, usuario.Correo));

            var credenciales = new SigningCredentials(
                new SymmetricSecurityKey(keyBytes),
                SecurityAlgorithms.HmacSha256Signature
            );

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = credenciales
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(tokenConfig);
        }
    }
}
