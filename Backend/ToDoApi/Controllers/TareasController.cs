using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ToDoApi.Models;

namespace ToDoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TareasController : ControllerBase
    {
        private readonly string cadenaConexion;

        public TareasController(IConfiguration config)
        {
            cadenaConexion = config.GetConnectionString("CadenaSQL");
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerTareas()
        {
            var lista = new List<Tarea>();

            using (var conexion = new SqlConnection(cadenaConexion))
            {
                await conexion.OpenAsync();
                
                using (var comando = new SqlCommand("SELECT * FROM Tareas", conexion))
                {
                    using (var lector = await comando.ExecuteReaderAsync())
                    {
                        while (await lector.ReadAsync())
                        {
                            var tarea = new Tarea();
                            tarea.Id = Convert.ToInt32(lector["Id"]);
                            tarea.Titulo = lector["Titulo"].ToString();
                            tarea.Completada = Convert.ToBoolean(lector["Completada"]);
                            tarea.FechaCreacion = Convert.ToDateTime(lector["FechaCreacion"]);

                            lista.Add(tarea);
                        }
                    }
                }
            }

            return Ok(lista);
        }

        [HttpPost]
        public async Task<IActionResult> CrearTarea([FromBody] Tarea nuevaTarea)
        {
            using (var conexion = new SqlConnection(cadenaConexion))
            {
                await conexion.OpenAsync();

                string query = "INSERT INTO Tareas (Titulo, Completada) VALUES (@Titulo, 0); SELECT SCOPE_IDENTITY();";

                using (var comando = new SqlCommand(query, conexion))
                {
                    comando.Parameters.AddWithValue("@Titulo", nuevaTarea.Titulo);

                    var idGenerado = await comando.ExecuteScalarAsync();
                    nuevaTarea.Id = Convert.ToInt32(idGenerado);
                }
            }

            return CreatedAtAction(nameof(ObtenerTareas), new { id = nuevaTarea.Id }, nuevaTarea);
        }
    }
}
