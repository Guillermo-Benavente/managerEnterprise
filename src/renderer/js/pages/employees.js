import { DOM, AddEvent, AddElement, Navigate } from 'Components/controlAPI.js';
import { EMPLOYEE, FormatEmployee, FormatDbEmployee, GetEmployees, SetEmployee, DeleteEmployee } from 'Components/dbAPI.js';
import { CreateFormWindow, AlertWindow } from 'Components/window.js';
import Table from 'Components/table.js';

DOM(() => {
    const idTable = 'tblEmployees';

    AddEvent('.pgBack', 'click', () => { Navigate('main_window'); });
    
    const table = new Table(idTable, EMPLOYEE, [{ width: "110px", targets: 3 },{ width: "110px", targets: 4 }, { width: "100px", targets: 8 }]);

    GetEmployees((success, data) => {
        if (success){
            table.init(FormatEmployee(data));
            table.addInteractiveRow('editemployees', 'Vas a eliminar un empleado ¿Estás Seguro?', (dni) => {
                DeleteEmployee(dni, (success) => { if (success) table.deleteRow(dni); });
            });
        } 
    });
    
    AddEvent('.wininCreate', 'click', () => {
        AddElement(CreateFormWindow('Datos del empleado', EMPLOYEE,
            (employee) => {
                console.log(Object.entries(employee).length);
                SetEmployee(FormatDbEmployee(employee), (success) => {
                    if (success) table.addRow(FormatEmployee(employee));
                    else AddElement(AlertWindow('error','No se ha podido añadir al empleado'));
                });
            }
        ,'Crear Empleado'));
    });
});