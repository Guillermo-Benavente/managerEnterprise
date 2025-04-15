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
            table.addInteractiveRowNavigation('editemployees');
            table.addInteractiveRowDelete('Vas a eliminar un curso ¿Estás Seguro?', (id) => {
                Delete(id, (success) => { if (success) table.deleteRow(id); });
            });
            table.init(data);
        } 
    });
});