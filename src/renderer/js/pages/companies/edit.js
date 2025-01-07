import { DOM, AddEvent, GetElement, AddElement, Navigate } from 'Components/controlAPI.js';
import { COMPANY, GetCompany, UpdateCompany } from 'Components/dbAPI.js';
import { CreateForm, CreateChangeDateForm } from 'Components/form.js';
import { AlertWindow } from 'Components/window.js';
import Alert from 'Types/alert.js';

DOM(() => {
    AddEvent('.pgBack', 'click', () => { Navigate('companies'); });

    window.onload = () => {
        const companyId = new URLSearchParams(window.location.search).get('id');

        GetCompany(companyId, (success, data) => {
            if(success){
                AddElement(CreateForm(data, COMPANY,
                    (company) => {
                        UpdateCompany(company, (success) => {
                            if (success) AddElement(AlertWindow(Alert.SUCCESS,'Información actualizada'));
                            else AddElement(AlertWindow(Alert.ERROR,'No se pudo actualizar la informacion con éxito'));
                        });
                    }
                ), GetElement('.frm-cnt'));

                //TODO agregar los nuevos botones para los documentos y un input para la fecha
                AddElement(CreateChangeDateForm({
                    'AptitudeCertificate':'Certificado de aptitud',
                    'Art1819':'Art. 18-19',
                    'MachineryUses':'Usos de maquinaria',
                    'HealthMonitoring':'Vigilancia de la salud',
                    'Epi':'Epi'
                }), GetElement('.frm-cnt'));
            }

            //TODO Añadir a empleados un nuevo campo de la fecha de DNI
            //TODO Añadir un check al lateral sobre si tiene o no asignado el documento de CreateChangeDateForm
        });
    };
});