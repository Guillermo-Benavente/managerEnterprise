import { DOM, AddEvent, Navigate, Modal, Dialog } from 'Components/controlAPI.js';
import { EMPLOYEE, FormatEmployee, FormatDbEmployee, GetEmployees, SetEmployee, DeleteEmployee } from 'Components/dbAPI.js';
import Alert from 'Types/alert.js';
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
        Modal('form', { title: 'Nuevo empleado', dataType: JSON.stringify(EMPLOYEE) })
        .then((employee) => {
            SetEmployee(FormatDbEmployee(employee), (success) => {
                if (success) table.addRow(FormatEmployee(employee));
                else Dialog('Error', 'No se ha podido añadir al empleado.', Alert.ERROR);
            });
        });
    });
});