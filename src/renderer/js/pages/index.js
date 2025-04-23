import { DOM, AddEvent, Navigate } from 'Components/controlAPI.js';
import ENTRY_POINTS_TYPE from 'Types/entryPoints.js';

DOM(() => {
    AddEvent('.pgEmployees', 'click', () => { Navigate(ENTRY_POINTS_TYPE.EMPLOYEES); });
    AddEvent('.pgCompanies', 'click', () => { Navigate(ENTRY_POINTS_TYPE.COMPANIES); });
});