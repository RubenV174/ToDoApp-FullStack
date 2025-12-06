const API_URL = "https://localhost:44385/api/tareas"

async function obtenerTareas() {
    try {
        const respuesta = await fetch(API_URL)
        const tareas = await respuesta.json()

        renderizarTareas(tareas)
    } catch (error) {
        console.error("Error al cargar tareas: ", error)
        alert("No se pudo conectar con el servidor. ¿Está corriendo el Backend?")
    }
}

function renderizarTareas(tareas) {
    const lista = document.getElementById("listaTareas")
    lista.innerHTML = ""

    tareas.forEach(tarea => {
        const item = document.createElement("li")

        if (tarea.completada) item.classList.add("completada")
        
            item.innerHTML = `
                <span onclick="actualizarTarea(${tarea.id})">${tarea.titulo}</span>
                <button class="btn-delete" onclick="eliminarTarea(${tarea.id})">X</button>
            `

            lista.appendChild(item)
    })
}

async function crearTarea() {
    const input = document.getElementById("inputTarea")
    const titulo = input.value

    if (!titulo) return

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ titulo: titulo })
    })

    input.value = ""
    obtenerTareas()
}

async function actualizarTarea(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT"
    })
    obtenerTareas()
}

async function eliminarTarea(id) {
    if(confirm("¿Seguro que quieres borrarla?")) {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
        obtenerTareas()
    }
}

obtenerTareas()