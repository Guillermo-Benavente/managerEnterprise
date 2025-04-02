export default class VariableInline {
    static get isInline() {
        return true;
    }

    constructor({api, config}) {
        this.api = api;
        this.config = config;
        this.variables = config.variables || [];
        this.setupKeyboardHandlers();
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('variable-selector');

        const selectElement = document.createElement('select');
        selectElement.innerHTML = `
        <option value="">Seleccionar Variable</option>
        ${this.variables.map(v => 
            `<option value="${v.key}">${v.label}</option>`
        ).join('')}
        `;

        selectElement.addEventListener('change', (event) => {
        const selectedVariable = this.variables.find(
            v => v.key === event.target.value
        );
        
        if (selectedVariable) {
            this.insertVariable(selectedVariable);
            event.target.value = ''; 
        }
        });

        wrapper.appendChild(selectElement);
        return wrapper;
    }

    insertVariable(variable) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        // Validar que no estemos dentro de una variable existente
        const isWithinVariable = this.checkIfWithinVariable(range.commonAncestorContainer);

        if (isWithinVariable) return;

        const variableSpan = document.createElement('span');
        variableSpan.classList.add('editor-variable');
        variableSpan.setAttribute('data-variable-key', variable.key);
        variableSpan.contentEditable = 'false';
        variableSpan.style.backgroundColor = '#e6f2ff';
        variableSpan.style.color = '#0066cc';
        variableSpan.style.padding = '2px 4px';
        variableSpan.style.borderRadius = '3px';
        variableSpan.textContent = variable.label;
        
        range.deleteContents();
        range.insertNode(variableSpan);
    }

    checkIfWithinVariable(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
        return node.closest('.editor-variable') !== null;
        }
        return node.parentElement && 
            node.parentElement.closest('.editor-variable') !== null;
    }

    setupKeyboardHandlers() {
        document.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace') {
            const selection = window.getSelection();
            if (selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const variableElement = this.findVariableElement(range.commonAncestorContainer);
            
            if (variableElement) {
            event.preventDefault();
            
            // Usar API de EditorJS para manejar la eliminación
            const blockIndex = this.api.blocks.getCurrentBlockIndex();
            const block = this.api.blocks.getBlockByIndex(blockIndex);
            
            // Eliminar el span de la variable
            variableElement.remove();
            
            // Forzar actualización del bloque
            this.api.blocks.update(blockIndex, block.holder.innerHTML);
            }
        }
        });
    }

    findVariableElement(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
        return node.closest('.editor-variable');
        }
        return node.parentElement ? 
            node.parentElement.closest('.editor-variable') : 
            null;
    }

    static get sanitize() {
        return {
        span: {
            'data-variable-key': true,
            class: true,
            style: true
        }
        };
    }

    save(blockContent) {
        const variables = blockContent.querySelectorAll('.editor-variable');
        return Array.from(variables).map(variable => ({
        type: 'variable',
        key: variable.getAttribute('data-variable-key'),
        content: variable.textContent
        }));
    }
}