import { useEffect, useState } from "react";

export default function Toast({ message, type = "success" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in
    const t1 = setTimeout(() => setVisible(true), 10);
    // Trigger fade-out before parent removes it
    const t2 = setTimeout(() => setVisible(false), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [message]);

  return (
    <div className={`toast toast-${type} ${visible ? "toast-show" : ""}`}>
      {message}
    </div>
  );
}
