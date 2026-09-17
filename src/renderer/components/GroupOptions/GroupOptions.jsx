import { useState, useRef } from 'react';
import Select from 'react-select';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './groupOptions.module.css';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';

export default function GroupOptions({ options }) {
  const [groups, setGroups] = useState([]);
  const prevStyleRef = useRef({ overflowY: '', pointerEvents: '' });
  const prevBodyOverflowRef = useRef('');
  const selectRefs = useRef({});

  const addGroup = () => {
    setGroups([...groups, { id: Date.now(), name: '', date: '', members: [], open: true }]);
  };

  const toggleGroup = (id) => {
    setGroups(groups.map(g => g.id === id ? { ...g, open: !g.open } : g));
  };

  const updateGroup = (id, field, value) => {
    setGroups(groups.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const deleteGroup = (id) => {
    setGroups(groups.filter(g => g.id !== id));
    delete selectRefs.current[id];
  };

  const updateMembers = (id, selectedOptions) => {
    setGroups(groups.map(g => g.id === id ? { ...g, members: selectedOptions || [] } : g));
  };

  const handleMenuOpen = () => {
    const list = document.querySelector(`.${styles.groupList}`);
    if (!list) return;
    prevStyleRef.current = {
      overflowY: list.style.overflowY || '',
      pointerEvents: list.style.pointerEvents || ''
    };
    list.style.overflowY = 'hidden';
    list.style.pointerEvents = 'none';
    prevBodyOverflowRef.current = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
  };

  const handleMenuClose = () => {
    const list = document.querySelector(`.${styles.groupList}`);
    if (!list) return;
    list.style.overflowY = prevStyleRef.current.overflowY || '';
    list.style.pointerEvents = prevStyleRef.current.pointerEvents || '';
    document.body.style.overflow = prevBodyOverflowRef.current || '';
  };

  const focusSelect = (groupId) => {
    const ref = selectRefs.current[groupId];
    if (!ref) return;
    if (typeof ref.focus === 'function') {
      ref.focus();
    } else if (ref && ref.select && typeof ref.select.focus === 'function') {
      ref.select.focus();
    } else if (ref && ref.inputRef && typeof ref.inputRef.focus === 'function') {
      ref.inputRef.focus();
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <Button type={ButtonType.PRIMARY} onClick={addGroup} className={styles.option}>
          Nuevo Grupo
        </Button>
      </div>

      <div className={styles.groupList}>
        {groups.map((group, idx) => (
          <div key={group.id} className={styles.groupBox}>
            <div className={styles.groupHeader}>
              <div onClick={() => toggleGroup(group.id)} className={styles.toggleIcon}>
                {group.open ? <ChevronUp /> : <ChevronDown />}
              </div>
              <div onClick={() => toggleGroup(group.id)} className={styles.groupTitle}>
                {group.name || 'Nuevo grupo'}
              </div>
              <div className={styles.actions}>
                <button onClick={() => deleteGroup(group.id)} className={styles.deleteButton}><X /></button>
              </div>
            </div>

            {group.open && (
              <div className={styles.groupContent} style={{ position: 'relative' }}>
                <input
                  type='text'
                  placeholder='Nombre del grupo'
                  name={`group-${group.id}-name`}
                  value={group.name}
                  onChange={e => updateGroup(group.id, 'name', e.target.value)}
                  className={styles.input}
                  required
                />
                <input
                  type='date'
                  name={`group-${group.id}-date`}
                  value={group.date}
                  onChange={e => updateGroup(group.id, 'date', e.target.value)}
                  className={styles.input}
                  required
                />

                <div className={styles.selectorPlaceholder} style={{ position: 'relative' }}>
                  <input
                    name={`groups[${idx}].members`}
                    required
                    value={group.members && group.members.length > 0 ? 'ok' : ''}
                    onChange={() => {}}
                    onFocus={() => focusSelect(group.id)}
                    className={styles.nativeValidationInput}
                    aria-hidden='false'
                  />

                  <Select
                    name={`group-${group.id}-members`}
                    ref={(el) => { if (el) selectRefs.current[group.id] = el; }}
                    isMulti
                    options={options}
                    value={group.members}
                    onChange={selected => updateMembers(group.id, selected)}
                    placeholder='Selecciona integrantes...'
                    menuPortalTarget={document.body}
                    menuPosition='fixed'
                    onMenuOpen={handleMenuOpen}
                    onMenuClose={handleMenuClose}
                    closeMenuOnSelect={false}
                    styles={{
                      menuPortal: base => ({ ...base, zIndex: 200, pointerEvents: 'auto' }),
                      menu: base => ({ ...base, maxHeight: '300px' })
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
