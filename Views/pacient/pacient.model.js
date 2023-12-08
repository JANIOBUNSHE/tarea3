
class Pacient_Model {
  constructor(
    UsuarioId,
    cedula,
    nombre,
    fecha_nacimiento,
    genero,
    tipo_enfermedad,
    correo,
    test,
    Ruta
  ) {
    this.UsuarioId = UsuarioId;
    this.cedula = cedula;
    this.nombre = nombre;
    this.fecha_nacimiento = fecha_nacimiento;
    this.genero = genero;
    this.tipo_enfermedad = tipo_enfermedad;
    this.correo = correo;
    this.test = test;
    this.Ruta = Ruta;
  }
  todos() {
    var html = "";
    $.get("../../Controllers/pacient.controller.php?op=" + this.Ruta, (res) => {
      res = JSON.parse(res);
      $.each(res, (index, valor) => {
        var fondo;
        if(valor.tipo_enfermedad == "diabetico") fondo ="bg-primary"
        else if(valor.tipo_enfermedad == "hipertencion") fondo = "bg-success"
        else if(valor.tipo_enfermedad == "cancer") fondo = "bg-warning"
        else if(valor.tipo_enfermedad == "infecciones") fondo = "bg-danger"
        else if(valor.tipo_enfermedad == "fracturas") fondo = "bg-info"
        html += `<tr>
                <td>${index + 1}</td>
                <td>${valor.nombre}</td>
                <td>${valor.fecha_nacimiento}</td>
                <td><div class="d-flex align-items-center gap-2">
                <span class="badge ${fondo} rounded-3 fw-semibold">${
                  valor.tipo_enfermedad
                }</span>
            </div></td>
            <td>
            <button class='btn btn-success' onclick='editar(${
              valor.paciente_id
            })'>Editar</button>
            <button class='btn btn-danger' onclick='eliminar(${
              valor.paciente_id
            })'>Eliminar</button>
            <button class='btn btn-info' onclick='ver(${
              valor.paciente_id
            })'>Ver</button>
            </td></tr>
                `;
      });
      $("#tabla_pacientes").html(html);
    });
  }

  insertar() {
    var dato = new FormData();
    dato = this.correo;
   $.ajax({
    url: "../../Controllers/pacient.controller.php?op=insertar",
    type: "POST",
    data: dato,
    contentType: false,
    processData: false,
    success: function (res) {
        res = JSON.parse(res);
        if(res === "ok"){
            Swal.fire("pacientes", "Paciente Registrado", "success");
            todos_controlador();
        }else{
            Swal.fire("Error", res, "error"); 
        }
    }
   });
   this.limpia_Cajas();    
  }

  uno() {
    var UsuarioId = this.UsuarioId;
    $.post(
      "../../Controllers/pacient.controller.php?op=uno",
      { UsuarioId: UsuarioId },
      (res) => {
        res = JSON.parse(res);
        $("#UsuarioId").val(res.paciente_id);
        $("#cedula").val(res.cedula);
        $("#nombre").val(res.nombre);
        $("#fecha_nacimiento").val(res.fecha_nacimiento);
        $("#genero").val(res.genero);
        $("#tipo_enfermedad").val(res.tipo_enfermedad);
        $("#correo").val(res.correo);
      }
    );
    $("#Modal_pacientes").modal("show");
  }

  eliminar() {
    console.log(this.UsuarioId)
    var UsuarioId = this.UsuarioId;

    Swal.fire({
      title: "Pacientes",
      text: "Esta seguro de eliminar el paciente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        $.post(
          "../../Controllers/pacient.controller.php?op=eliminar",
          { UsuarioId: UsuarioId },
          (res) => {
            console.log(res);
            
            res = JSON.parse(res);
            if (res === "ok") {
              Swal.fire("pacientes", "Paciente Eliminado", "success");
              todos_controlador();
            } else {
              Swal.fire("Error", res, "error");
            }
          }
        );
      }
    });

    this.limpia_Cajas();
  }

  editar() {
    var dato = new FormData();
    dato = this.correo;
    console.log('usuario',this.UsuarioId)
    console.log('cedula',this.cedula)
    console.log('nombre',this.nombre)
    console.log('fecha',this.fecha_nacimiento)
    console.log('genero',this.genero)
    console.log('enfermedad',this.tipo_enfermedad)
    console.log('correo',this.correo)
    console.log('test',this.test)
    console.log('ruta',this.Ruta)


    $.ajax({
      url: "../../Controllers/pacient.controller.php?op=actualizar",
      type: "POST",
      data: dato,
      contentType: false,
      processData: false,
      success: function (res) {
        res = JSON.parse(res);
        if (res === "ok") {
          Swal.fire("pacientes", "Paciente Actualizado", "success");
          todos_controlador();
        } else {
          Swal.fire("Error", res, "error");
        }
      },
    });
    this.limpia_Cajas();
  }

  cedula_repetida(){
    var Cedula = this.Cedula;
    $.post("../../Controllers/pacient.controller.php?op=cedula_repetida", {Cedula: Cedula}, (res) => {
        res = JSON.parse(res);
        if( parseInt(res.cedula_repetida) > 0){
            $('#CedulaRepetida').removeClass('d-none');
            $('#CedulaRepetida').html('La cédula ingresa, ya exite en la base de datos');
            $('button').prop('disabled', true);
        }else{
            $('#CedulaRepetida').addClass('d-none');
            $('button').prop('disabled', false);
        }

    })
  }

  verifica_correo(){
    var Correo = this.Correo;
    $.post("../../Controllers/pacient.controller.php?op=verifica_correo", {Correo: Correo}, (res) => {
        res = JSON.parse(res);
        if( parseInt(res.cedula_repetida) > 0){
            $('#CorreoRepetido').removeClass('d-none');
            $('#CorreoRepetido').html('El correo ingresado, ya exite en la base de datos');
            $('button').prop('disabled', true);
        }else{
            $('#CorreoRepetido').addClass('d-none');
            $('button').prop('disabled', false);
        }
    })
  }

  limpia_Cajas(){
    document.getElementById("cedula").value = "";
    document.getElementById("nombre").value = "";  
    document.getElementById("fecha_nacimiento").value = "";
    document.getElementById("genero").value = "";
    document.getElementById("tipo_enfermedad").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("test").value = "";
    $("#Modal_pacientes").modal("hide");
  }
}
