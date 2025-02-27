import { DOM, AddEvent, Navigate } from 'Components/controlAPI.js';
import { COURSE, GetCourses } from 'Components/dbAPI.js';
import Table from 'Components/table.js';

DOM(() => {
    const idTable = 'tblCourses';
    const employeeId = new URLSearchParams(window.location.search).get('id');

    AddEvent('.pgBack', 'click', () => { Navigate('editemployees', {id:employeeId} ); });
    
    const table = new Table(idTable, COURSE, [{ width: "100px", targets: 1 }]);

    GetCourses(employeeId, (success, data) => {
        if (success){
            table.init(data);
            table.addInteractiveRow('editemployees', 'Vas a eliminar un curso ¿Estás Seguro?', (id) => {
                Delete(id, (success) => { if (success) table.deleteRow(id); });
            });
        } 
    });
    
    /*AddEvent('.wininCreate', 'click', () => {
        AddElement(CreateFormWindow('Datos del empleado', EMPLOYEE,
            (employee) => {
                console.log(Object.entries(employee).length);
                SetEmployee(FormatDbEmployee(employee), (success) => {
                    if (success) table.addRow(FormatEmployee(employee));
                    else AddElement(AlertWindow('error','No se ha podido añadir el curso'));
                });
            }
        ,'Crear Empleado'));
    });*/
});