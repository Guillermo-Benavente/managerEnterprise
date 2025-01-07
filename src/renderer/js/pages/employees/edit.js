import { DOM, AddEvent, GetElement, AddElement, Navigate } from 'Components/controlAPI.js';
import { EMPLOYEE, FormatEmployee, GetEmployee, UpdateEmployee } from 'Components/dbAPI.js';
import { CreateForm, CreateChangeDateForm } from 'Components/form.js';
import { AlertWindow } from 'Components/window.js';
import Alert from 'Types/alert.js';

DOM(() => {
    AddEvent('.pgBack', 'click', () => { Navigate('employees'); });

    window.onload = () => {
        const employeeId = new URLSearchParams(window.location.search).get('id');

        GetEmployee(employeeId, (success, data) => {
            if(success){
                AddElement(CreateForm(FormatEmployee(data), EMPLOYEE, 
                    (employee) => {
                        let surnamesArray = employee.surnames.split(" ");
                        let newFormatEmployee = {
                            'dni': employee.dni,
                            'name': employee.name,
                            'first_surname': surnamesArray[0],
                            'second_surname': surnamesArray[1] || '',
                            'discharge_date': employee.discharge_date,
                            'leave_date': employee.leave_date,
                            'medical_leave_date': employee.medical_leave_date,
                            'medical_discharge_date': employee.medical_discharge_date,
                            'courses': employee.courses
                        };

                        UpdateEmployee(newFormatEmployee, (success) => {
                            if (success) AddElement(AlertWindow(Alert.SUCCESS,'Información actualizada'));
                            else AddElement(AlertWindow(Alert.ERROR,'No se pudo actualizar la informacion con éxito'));
                        });
                    }
                ), GetElement('.frm-cnt'));

                //TODO agregar los nuevos botones para los documentos y un input para la fecha
                /*AddElement(CreateChangeDateForm({
                    'AptitudeCertificate':'Certificado de aptitud',
                    'Art1819':'Art. 18-19',
                    'MachineryUses':'Usos de maquinaria',
                    'HealthMonitoring':'Vigilancia de la salud',
                    'Epi':'Epi'
                }), GetElement('.frm-cnt'));*/
            }

            AddEvent('.pgCourse', 'click', () => { Navigate('courseemployees', {id:employeeId} ); });

            //TODO Añadir a empleados un nuevo campo de la fecha de DNI
            //TODO Añadir un check al lateral sobre si tiene o no asignado el documento de CreateChangeDateForm
        });
    };
});