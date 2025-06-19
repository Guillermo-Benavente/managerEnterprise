import { DOM, AddEvent, Navigate } from 'Components/controlAPI.js';
import EntryPointsType from 'Types/entryPoints.js';

DOM(() => {
    AddEvent('click', () => { Navigate(EntryPointsType.EMPLOYEES); }, '.pgEmployees');
    AddEvent('click', () => { Navigate(EntryPointsType.COMPANIES); }, '.pgCompanies');
});