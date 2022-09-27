//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul')


//Eventos
eventListeners()
function eventListeners(){
    document.addEventListener('DOMContentLoaded',peguntarPresupuesto);
    formulario.addEventListener('submit',agregarGasto)
}



//Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []

    }

    nuevoGasto(gasto){
       this.gastos = [...this.gastos,gasto]
       this.calcularRestante()
    }
    calcularRestante(){
        const gastado = this.gastos.reduce((total,gasto)=> total + gasto.cantidad, 0 )
        this.restante = this.presupuesto - gastado
        console.log(this.restante)
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto=> gasto.id !== id);
        this.calcularRestante()
    }
    
}
class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto,restante} = cantidad
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
    }

    imprimarAlerta(mensaje,tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert');

        if(tipo=='error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success')
        }

        divMensaje.textContent= mensaje

        //insertar en html
        document.querySelector('.primario').insertBefore(divMensaje,formulario)
        //quitar
        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }

    agregarGastoListado(gastos){
        this.limpiarHTML()
        //iterar sobre gastos
        gastos.forEach(gasto=>{
           const {cantidad,nombre,id} = gasto
           //crear li   
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.setAttribute('data-id',id)

           //Agregar HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>            
            `
           //Boton para borrar el gasto
           const btnBorrar = document.createElement('button');
           btnBorrar.classList.add('btn', 'btn-danger','borrar-gasto');nuevoGasto.appendChild(btnBorrar)
           btnBorrar.innerHTML = 'Borrar' 
           btnBorrar.onclick = ()=>{
             eliminarGasto(id);
           }
           nuevoGasto.appendChild(btnBorrar);

           //Agregar al HTML
           gastoListado.appendChild(nuevoGasto)
        })
            
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante
    }
    comprobarPresupuesto(presupuestoObj){
        const{presupuesto,restante} = presupuestoObj
        const restanteDiv = document.querySelector('.restante')
        //Comprobar 25%
        if((presupuesto/4)> restante){
        restanteDiv.classList.remove('alert-success', 'alert-warning');
        restanteDiv.classList.add('alert-danger')
        }else if((presupuesto/2)> restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning')
        }

        //si el presupuesto es 0 o menor
        if(restante <=0){
            ui.imprimarAlerta('El presupuesto se ha agotado','error')
            formulario.querySelector('button[type="submit"]' ).disabled = true
        }
    }
}

//Intanciar
const ui = new UI()
let presupuesto;

//Funciones

function peguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');
    

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario)|| presupuestoUsuario<=0) {
        window.location.reload()
    }
    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario)
    console.log(presupuesto)

    ui.insertarPresupuesto(presupuesto)
}

//Añadir gastos
function agregarGasto(e){
    e.preventDefault()

    //Leer los datos de formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar
    if(nombre == '' || cantidad ==''){
            ui.imprimarAlerta('Ambos campos son obligatorios','error');
            return
    }else if(cantidad <=0 || isNaN(cantidad)){
        ui.imprimarAlerta('Cantidad no valida','error');
        return
    }
    //Objeto de gasto
    const gasto = {nombre,cantidad,id:Date.now()}
    //nuevo gasto
    presupuesto.nuevoGasto(gasto)
    //Mensaje todo bien
    ui.imprimarAlerta('Gasto agregado correctamente')
    //Imprimir los gastos
    const {gastos,restante} = presupuesto
    ui.agregarGastoListado(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)
    //Reiniciar formulario
    formulario.reset()
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id)
    const {gastos,restante} = presupuesto
    ui.agregarGastoListado(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)
}