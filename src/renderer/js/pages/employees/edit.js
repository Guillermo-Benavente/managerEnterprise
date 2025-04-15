import { DOM, AddEvent, GetElement, AddElement, Navigate, Dialog } from 'Components/controlAPI.js';
import { EMPLOYEE, FormatEmployee, FormatDbEmployee, GetEmployee, UpdateEmployee } from 'Components/dbAPI.js';
import { CreateForm } from 'Components/form.js';
import DIALOG_TYPE from 'Types/dialog.js';

DOM(() => {
    AddEvent('.pgBack', 'click', () => { Navigate('employees'); });

    window.onload = () => {
        const employeeId = new URLSearchParams(window.location.search).get('id');

        GetEmployee(employeeId, (success, data) => {
            if(success){
                AddElement(CreateForm(FormatEmployee(data), EMPLOYEE, 
                    (employee) => {
                        UpdateEmployee(FormatDbEmployee(employee), (success) => {
                            if (success) Dialog('Información', 'Información actualizada.', DIALOG_TYPE.INFO).then(() => { Navigate('employees'); });
                            else Dialog('Error', 'No se pudo actualizar la informacion con éxito.', DIALOG_TYPE.ERROR);
                        });
                    }
                ), GetElement('.frm-cnt'));
            }

            AddEvent('.pgCourse', 'click', () => { Navigate('courseemployees', {id:employeeId} ); });

            //TODO Añadir a empleados un nuevo campo de la fecha de DNI
        });
    };
});