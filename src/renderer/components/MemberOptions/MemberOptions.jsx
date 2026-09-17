// MemberOptions.jsx
import { useState, useRef, useMemo, useEffect } from "react";
import Select from "react-select";
import { X } from "lucide-react";
import styles from "./memberoptions.module.css";

// Helpers
const normalizeOptions = (options) =>
  (options || []).map((o) => ({
    ...o,
    _id: o.id ?? o.value ?? o._id ?? JSON.stringify(o),
    _label: o.label ?? o.name ?? String(o),
  }));

const mapMembers = (data) =>
  data.map((v) => ({
    _id: v.id ?? v.employee ?? JSON.stringify(v),
    _label: v.employee ?? v.id ?? "Sin nombre",
    original: v,
    extraData: v.date ?? "",
  }));

export default function MemberOptions({ options = [], value }) {
  const [members, setMembers] = useState([]);
  const [selectValue, setSelectValue] = useState(null);
  const prevBodyOverflowRef = useRef("");

  // Normalizamos opciones del select
  const normalized = useMemo(() => normalizeOptions(options), [options]);

  // Carga inicial de miembros
  useEffect(() => {
    const loadInitialMembers = async () => {
      try {
        if (typeof value !== "function") return;
        const result = await value();

        if (Array.isArray(result)) {
          const mapped = result.map((v) => {
              const opt = normalized.find((o) => o._id === v.employee);
              if(opt) return {
                ...opt,
                extraData: v.date ?? "",
                original: v,
              };
            }).filter(Boolean);
          setMembers(mapped);
        }
      } catch (err) {
        console.error("Error cargando miembros:", err);
      }
    };

    loadInitialMembers();
  }, []);

  // Eventos del select
  const handleMenuOpen = () => {
    prevBodyOverflowRef.current = document.body.style.overflow || "";
    document.body.style.overflow = "hidden";
  };

  const handleMenuClose = () => {
    document.body.style.overflow = prevBodyOverflowRef.current || "";
  };

  const addMember = (opt) => {
    if (!opt) return;
    const incomingId = opt.value ?? opt._id ?? opt.id ?? JSON.stringify(opt);
    const incomingLabel = opt.label ?? opt._label ?? opt.name ?? String(opt);

    if (members.some((m) => m._id === incomingId)) {
      setSelectValue(null);
      return;
    }

    setMembers((prev) => [
      ...prev,
      {
        _id: incomingId,
        _label: incomingLabel,
        original: opt,
        extraData: "",
      },
    ]);
    setSelectValue(null);
  };

  const updateMemberData = (id, value) =>
    setMembers((prev) =>
      prev.map((m) => (m._id === id ? { ...m, extraData: value } : m))
    );

  const removeMember = (id) =>
    setMembers((prev) => prev.filter((m) => m._id !== id));

  // Opciones filtradas (solo las que no están ya en members)
  const filteredOptions = normalized
    .filter((o) => !members.some((m) => m._id === o._id))
    .map((o) => ({ value: o._id, label: o._label, __orig: o }));

  return (
    <div className={styles.container}>
      <Select
        options={filteredOptions}
        value={selectValue}
        onChange={addMember}
        placeholder="Selecciona un usuario..."
        menuPortalTarget={document.body}
        menuPosition="fixed"
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 200, pointerEvents: "auto" }),
          menu: (base) => ({ ...base, maxHeight: "300px" }),
        }}
        closeMenuOnSelect
      />

      <div className={styles.memberList}>
        {members.map((member) => (
          <div key={member._id} className={styles.memberCard}>
            <span>{member._label}</span>
            <input
              type="date"
              name={`member-${member._id}-date`}
              value={member.extraData}
              onChange={(e) => updateMemberData(member._id, e.target.value)}
              className={styles.input}
              required
            />
            <button
              onClick={() => removeMember(member._id)}
              className={styles.removeButton}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
