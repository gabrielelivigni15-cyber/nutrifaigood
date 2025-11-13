"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../../lib/supabaseClient"
import { Plus, Users } from "lucide-react"

export default function AdminUtenti() {
  const [utenti, setUtenti] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    ruolo: "cliente",
    coach_id: null
  })

  const loadUtenti = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("profiles")
      .select("*, auth:auth.users(email)")

    if (!error) setUtenti(data)

    setLoading(false)
  }

  useEffect(() => {
    loadUtenti()
  }, [])

  const createUser = async () => {
    try {
      // 1. Creazione utente su auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: form.email,
        password: form.password,
        email_confirm: true
      })

      if (authError) {
        alert(authError.message)
        return
      }

      const userId = authUser.user.id

      // 2. Creazione riga in profiles
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        nome: form.nome,
        cognome: form.cognome,
        ruolo: form.ruolo,
        coach_id: form.ruolo === "cliente" ? form.coach_id : null,
        stato_abbonamento: "attivo",
        is_active: true
      })

      if (profileError) {
        alert(profileError.message)
        return
      }

      alert("Utente creato con successo!")
      setShowForm(false)
      loadUtenti()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="text-gray-100">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" /> Gestione Utenti
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-nutriPrimary rounded-xl text-black flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Aggiungi Utente
        </button>
      </div>

      {/* FORM INSERIMENTO */}
      {showForm && (
        <div className="bg-black/40 p-5 rounded-xl border border-white/10 mb-6 space-y-3">
          <h2 className="text-lg font-medium">Nuovo Utente</h2>

          <div className="grid grid-cols-2 gap-3">
            <input className="bg-black/30 p-2 rounded-xl"
              placeholder="Nome"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
            />

            <input className="bg-black/30 p-2 rounded-xl"
              placeholder="Cognome"
              value={form.cognome}
              onChange={e => setForm({ ...form, cognome: e.target.value })}
            />

            <input className="bg-black/30 p-2 rounded-xl col-span-2"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />

            <input className="bg-black/30 p-2 rounded-xl col-span-2"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />

            <select
              className="bg-black/30 p-2 rounded-xl col-span-2"
              value={form.ruolo}
              onChange={e => setForm({ ...form, ruolo: e.target.value })}
            >
              <option value="cliente">Cliente</option>
              <option value="coach">Coach</option>
              <option value="admin">Admin</option>
            </select>

            {/* Campo coach solo per clienti */}
            {form.ruolo === "cliente" && (
              <input
                className="bg-black/30 p-2 rounded-xl col-span-2"
                placeholder="Coach ID (temporaneo)"
                value={form.coach_id || ""}
                onChange={e => setForm({ ...form, coach_id: e.target.value })}
              />
            )}
          </div>

          <button
            onClick={createUser}
            className="px-4 py-2 bg-nutriAccent rounded-xl text-black"
          >
            Crea Utente
          </button>
        </div>
      )}

      {/* LISTA UTENTI */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-4">
        {loading ? (
          <p>Caricamento...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-white/5">
                <th className="py-2 text-left">Nome</th>
                <th className="py-2 text-left">Email</th>
                <th className="py-2 text-left">Ruolo</th>
                <th className="py-2 text-left">Coach</th>
                <th className="py-2 text-left">Stato</th>
              </tr>
            </thead>

            <tbody>
              {utenti.map(u => (
                <tr key={u.id} className="border-b border-white/5">
                  <td className="py-2">{u.nome} {u.cognome}</td>
                  <td>{u.auth?.email}</td>
                  <td>{u.ruolo}</td>
                  <td>{u.coach_id || "-"}</td>
                  <td>{u.is_active ? "Attivo" : "Disattivo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}
