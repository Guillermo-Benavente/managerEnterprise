import { DOM, AddEvent, Navigate } from 'Components/controlAPI.js';

DOM(() => {
    AddEvent('.pgEmployees', 'click', () => { Navigate('employees'); });
    AddEvent('.pgCompanies', 'click', () => { Navigate('companies'); });
});