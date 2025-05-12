import { DOM, AddEvent, Navigate } from 'Components/controlAPI.js';
import EntryPointsType from 'Types/entryPoints.js';

DOM(() => {
    AddEvent('.pgEmployees', 'click', () => { Navigate(EntryPointsType.EMPLOYEES); });
    AddEvent('.pgCompanies', 'click', () => { Navigate(EntryPointsType.COMPANIES); });
});