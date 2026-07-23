import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createGrowRoom, getGrowRoomById, updateGrowRoom } from "@/services/growRoomService";
import type { RoomStatus, RoomType, LightingType, SensorType } from "@/types/cultivation";

const PRESET_ENTORNOS = ["indoor", "outdoor", "invernadero"] as const;
const PRESET_MEDIOS   = ["sustrato", "fibra_de_coco", "lana_de_roca", "hidroponia", "aeroponia"] as const;

const ROOM_TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "vegetativo", label: "Vegetativo" },
  { value: "floracion", label: "Floracion" },
  { value: "madres", label: "Madres" },
  { value: "esquejes", label: "Esquejes" },
  { value: "secado", label: "Secado" },
  { value: "curado", label: "Curado" },
];

const GROUP_A = new Set(["vegetativo", "floracion", "madres", "esquejes"]);
const GROUP_B = new Set(["secado", "curado"]);

const ALL_SENSORS: SensorType[] = ["temperatura", "humedad", "co2", "vpd", "temperatura_hoja", "ph", "ec", "otro"];
const POST_CULTIVO_SENSORS: SensorType[] = ["temperatura", "humedad", "otro"];

const SENSOR_LABELS: Record<SensorType, string> = {
  temperatura: "Temperatura",
  humedad: "Humedad",
  co2: "CO2",
  vpd: "VPD",
  temperatura_hoja: "Temp. Hoja",
  ph: "PH",
  ec: "EC",
  otro: "Otro",
};

export const Route = createFileRoute("/app/cultivo/salas/nueva")({
  validateSearch: (search: Record<string, unknown>) => ({
    edit: search.edit != null ? String(search.edit) : undefined,
  }),
  head: () => ({ meta: [{ title: "Nueva sala - Cannabis Club Manager" }] }),
  component: NewGrowRoomPage,
});

type GrowRoomForm = {
  code: string;
  name: string;
  type: string;
  status: RoomStatus;
  lightingType: LightingType;
  installedPowerWatts: string;
  ventilationSystem: string;
  extractionSystem: string;
  irrigationSystem: "manual" | "automatico";
  hasAirConditioning: "si" | "no";
  hasDehumidifier: "si" | "no";
  installedSensors: SensorType[];
  cultivationType: string;
  growMedium: string;
  notes: string;
};

const initialForm: GrowRoomForm = {
  code: "",
  name: "",
  type: "vegetativo",
  status: "activa",
  lightingType: "led",
  installedPowerWatts: "0",
  ventilationSystem: "",
  extractionSystem: "",
  irrigationSystem: "manual",
  hasAirConditioning: "no",
  hasDehumidifier: "no",
  installedSensors: [],
  cultivationType: "",
  growMedium: "",
  notes: "",
};

function parseRoomTypes(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinRoomTypes(values: string[]): string {
  return values.join(", ");
}

function NewGrowRoomPage() {
  const navigate = useNavigate();
  const { edit: editId } = Route.useSearch();
  const [form, setForm] = useState<GrowRoomForm>(initialForm);
  const [loading, setLoading] = useState(Boolean(editId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [customTypeOpen, setCustomTypeOpen] = useState(false);
  const [customTypeInput, setCustomTypeInput] = useState("");
  const customTypeRef = useRef<HTMLInputElement>(null);
  const [customMediumOpen, setCustomMediumOpen] = useState(false);
  const [customMediumInput, setCustomMediumInput] = useState("");
  const customMediumRef = useRef<HTMLInputElement>(null);

  const selectedTypes = parseRoomTypes(form.type);
  const hasGroupA = selectedTypes.some((t) => GROUP_A.has(t));
  const hasGroupB = selectedTypes.some((t) => GROUP_B.has(t));
  const isPostCultivo = hasGroupB && !hasGroupA;
  const availableSensors = isPostCultivo ? POST_CULTIVO_SENSORS : ALL_SENSORS;

  useEffect(() => {
    if (!editId) {
      setLoading(false);
      return;
    }

    const safeId = editId;

    async function loadRoom() {
      try {
        const room = await getGrowRoomById(safeId);
        if (!room) {
          setError("Sala no encontrada.");
          return;
        }

        const types = room.type.split(",").map((t) => t.trim());
        const roomHasGroupB = types.some((t) => GROUP_B.has(t));
        const roomHasGroupA = types.some((t) => GROUP_A.has(t));
        const roomIsPostCultivo = roomHasGroupB && !roomHasGroupA;
        const validSensors = roomIsPostCultivo ? POST_CULTIVO_SENSORS : ALL_SENSORS;

        setForm({
          code: room.code,
          name: room.name,
          type: room.type,
          status: room.status,
          lightingType: room.technicalConfig.lightingType ?? "led",
          installedPowerWatts: String(room.technicalConfig.installedPowerWatts),
          ventilationSystem: room.technicalConfig.ventilationSystem ?? "",
          extractionSystem: room.technicalConfig.extractionSystem ?? "",
          irrigationSystem: room.technicalConfig.irrigationSystem === "automatico" ? "automatico" : "manual",
          hasAirConditioning: room.technicalConfig.hasAirConditioning ? "si" : "no",
          hasDehumidifier: room.technicalConfig.hasDehumidifier ? "si" : "no",
          installedSensors: room.technicalConfig.installedSensors.filter((s) =>
            validSensors.includes(s as SensorType),
          ) as SensorType[],
          cultivationType: room.cultivationType ?? "",
          growMedium: room.growMedium ?? "",
          notes: room.notes ?? "",
        });
      } finally {
        setLoading(false);
      }
    }

    void loadRoom();
  }, [editId]);

  function toggleSensor(sensor: SensorType) {
    setForm((current) => {
      const enabled = current.installedSensors.includes(sensor);
      return {
        ...current,
        installedSensors: enabled
          ? current.installedSensors.filter((item) => item !== sensor)
          : [...current.installedSensors, sensor],
      };
    });
  }

  function handleTypeChange(value: string, nextChecked: boolean) {
    const current = parseRoomTypes(form.type);
    let nextTypes = nextChecked
      ? [...current, value]
      : current.filter((item) => item !== value);

    if (nextChecked && GROUP_A.has(value)) nextTypes = nextTypes.filter((t) => !GROUP_B.has(t));
    if (nextChecked && GROUP_B.has(value)) nextTypes = nextTypes.filter((t) => !GROUP_A.has(t));

    const newHasGroupB = nextTypes.some((t) => GROUP_B.has(t));
    const newHasGroupA = nextTypes.some((t) => GROUP_A.has(t));
    const newIsPostCultivo = newHasGroupB && !newHasGroupA;
    const validSensors = newIsPostCultivo ? POST_CULTIVO_SENSORS : ALL_SENSORS;

    setForm((prev) => ({
      ...prev,
      type: joinRoomTypes(nextTypes),
      installedSensors: prev.installedSensors.filter((s) => validSensors.includes(s)),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.code.trim()) { setError("El codigo de sala es obligatorio."); return; }
    if (!form.name.trim()) { setError("El nombre de sala es obligatorio."); return; }
    if (!parseRoomTypes(form.type).length) { setError("Selecciona al menos un tipo de sala."); return; }

    const installedPowerWatts = isPostCultivo ? 0 : Number(form.installedPowerWatts);
    if (!isPostCultivo && (!Number.isInteger(installedPowerWatts) || installedPowerWatts < 0)) {
      setError("La potencia debe ser un numero entero mayor o igual a 0.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        type: form.type as RoomType,
        status: form.status,
        installedPowerWatts,
        irrigationSystem: form.irrigationSystem,
        hasAirConditioning: form.hasAirConditioning === "si",
        hasDehumidifier: form.hasDehumidifier === "si",
        installedSensors: form.installedSensors as string[],
        cultivationType: form.cultivationType.trim() || undefined,
        growMedium: form.growMedium.trim() || undefined,
        notes: form.notes.trim() || undefined,
      };

      const room = editId ? await updateGrowRoom(editId, payload) : await createGrowRoom(payload);
      await navigate({ to: "/app/cultivo/salas/$id", params: { id: room.id } });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "No se pudo guardar la sala.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <div className="space-y-1">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/app/cultivo/salas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Salas
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{editId ? "Editar sala" : "Nueva sala"}</h1>
        <p className="text-sm text-muted-foreground">
          {editId ? "Modificacion de sala de cultivo." : "Alta de sala de cultivo."}
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      ) : null}

      {loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Cargando datos de la sala...</CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Card: Informacion basica */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Informacion de sala</CardTitle>
              <CardDescription>Datos basicos e identificacion.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="code">Codigo de sala</Label>
                  <Input
                    id="code"
                    value={form.code}
                    onChange={(event) => setForm({ ...form, code: event.target.value })}
                    placeholder="SALA-FL-01"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Floracion 1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Estado</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as RoomStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activa">Activa</SelectItem>
                      <SelectItem value="limpieza">Limpieza</SelectItem>
                      <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                      <SelectItem value="fuera_de_uso">Fuera de uso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Entorno de cultivo</Label>
                  <Select
                    value={PRESET_ENTORNOS.includes(form.cultivationType as typeof PRESET_ENTORNOS[number]) ? form.cultivationType : form.cultivationType ? "otro" : ""}
                    onValueChange={(v) => { if (v === "otro") { setCustomTypeInput(""); setCustomTypeOpen(true); } else setForm({ ...form, cultivationType: v }); }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar entorno">
                        {form.cultivationType && !PRESET_ENTORNOS.includes(form.cultivationType as typeof PRESET_ENTORNOS[number]) ? form.cultivationType : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="invernadero">Invernadero</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Tipo de cultivo</Label>
                  <Select
                    value={PRESET_MEDIOS.includes(form.growMedium as typeof PRESET_MEDIOS[number]) ? form.growMedium : form.growMedium ? "otro" : ""}
                    onValueChange={(v) => { if (v === "otro") { setCustomMediumInput(""); setCustomMediumOpen(true); } else setForm({ ...form, growMedium: v }); }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo">
                        {form.growMedium && !PRESET_MEDIOS.includes(form.growMedium as typeof PRESET_MEDIOS[number]) ? form.growMedium : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sustrato">Sustrato</SelectItem>
                      <SelectItem value="fibra_de_coco">Fibra de coco</SelectItem>
                      <SelectItem value="lana_de_roca">Lana de roca</SelectItem>
                      <SelectItem value="hidroponia">Hidroponia</SelectItem>
                      <SelectItem value="aeroponia">Aeroponia</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Observaciones</Label>
                <Textarea
                  id="notes"
                  rows={2}
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  placeholder="Observaciones operativas de la sala"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card: Tipo de sala */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tipo de sala</CardTitle>
              <CardDescription>Determina el uso y configura automaticamente las opciones disponibles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-2 rounded-md border border-input bg-background/70 p-3 shadow-sm dark:bg-muted/35 sm:grid-cols-3">
                {ROOM_TYPE_OPTIONS.map((option) => {
                  const checked = selectedTypes.includes(option.value);
                  const disabled = (GROUP_A.has(option.value) && hasGroupB) || (GROUP_B.has(option.value) && hasGroupA);
                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm ${disabled ? "cursor-not-allowed opacity-40" : "hover:bg-muted/60"}`}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={disabled}
                        onCheckedChange={(nextChecked) => handleTypeChange(option.value, Boolean(nextChecked))}
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
              {isPostCultivo && (
                <p className="text-xs text-muted-foreground">
                  Sala de post-cultivo: iluminacion, potencia y sistema de riego no aplican.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Card: Configuracion tecnica */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Configuracion tecnica</CardTitle>
              <CardDescription>Equipamiento e instalaciones de la sala.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                {!isPostCultivo && (
                  <>
                    <div className="space-y-1.5">
                      <Label>Tipo de iluminacion</Label>
                      <Select
                        value={form.lightingType}
                        onValueChange={(v) => setForm({ ...form, lightingType: v as LightingType })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="led">LED</SelectItem>
                          <SelectItem value="hps">HPS</SelectItem>
                          <SelectItem value="cmh">CMH</SelectItem>
                          <SelectItem value="mixta">Mixta</SelectItem>
                          <SelectItem value="otra">Otra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="installedPowerWatts">Potencia total instalada (W)</Label>
                      <Input
                        id="installedPowerWatts"
                        type="number"
                        min="0"
                        step="1"
                        value={form.installedPowerWatts}
                        onChange={(event) => setForm({ ...form, installedPowerWatts: event.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <Label>Sistema de ventilacion</Label>
                  <Input
                    value={form.ventilationSystem}
                    onChange={(event) => setForm({ ...form, ventilationSystem: event.target.value })}
                    placeholder="Extractor 200mm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Sistema de extraccion</Label>
                  <Input
                    value={form.extractionSystem}
                    onChange={(event) => setForm({ ...form, extractionSystem: event.target.value })}
                    placeholder="Carbon activo + extractor"
                  />
                </div>

                {!isPostCultivo && (
                  <div className="space-y-1.5">
                    <Label>Sistema de riego</Label>
                    <Select
                      value={form.irrigationSystem}
                      onValueChange={(v) => setForm({ ...form, irrigationSystem: v as "manual" | "automatico" })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatico">Automatico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label>Aire acondicionado</Label>
                  <Select
                    value={form.hasAirConditioning}
                    onValueChange={(v) => setForm({ ...form, hasAirConditioning: v as "si" | "no" })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Si</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Deshumidificador</Label>
                  <Select
                    value={form.hasDehumidifier}
                    onValueChange={(v) => setForm({ ...form, hasDehumidifier: v as "si" | "no" })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Si</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sensores instalados</Label>
                <div className="flex flex-wrap gap-2">
                  {availableSensors.map((sensor) => {
                    const active = form.installedSensors.includes(sensor);
                    return (
                      <Button
                        key={sensor}
                        type="button"
                        variant={active ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSensor(sensor)}
                      >
                        {SENSOR_LABELS[sensor]}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? "Guardando..." : editId ? "Guardar cambios" : "Guardar sala"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* Modal entorno personalizado */}
      <Dialog open={customTypeOpen} onOpenChange={(open) => { if (!open && !form.cultivationType) setForm((f) => ({ ...f, cultivationType: "" })); setCustomTypeOpen(open); }}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader><DialogTitle>Entorno de cultivo personalizado</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="customType">Describí el entorno de cultivo</Label>
            <Input id="customType" ref={customTypeRef} autoFocus value={customTypeInput}
              onChange={(e) => setCustomTypeInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (customTypeInput.trim()) { setForm((f) => ({ ...f, cultivationType: customTypeInput.trim() })); setCustomTypeOpen(false); } } }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomTypeOpen(false)}>Cancelar</Button>
            <Button disabled={!customTypeInput.trim()} onClick={() => { setForm((f) => ({ ...f, cultivationType: customTypeInput.trim() })); setCustomTypeOpen(false); }}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal tipo de cultivo personalizado */}
      <Dialog open={customMediumOpen} onOpenChange={(open) => { if (!open && !form.growMedium) setForm((f) => ({ ...f, growMedium: "" })); setCustomMediumOpen(open); }}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader><DialogTitle>Tipo de cultivo personalizado</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="customMedium">Describí el tipo de cultivo</Label>
            <Input id="customMedium" ref={customMediumRef} autoFocus value={customMediumInput}
              onChange={(e) => setCustomMediumInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (customMediumInput.trim()) { setForm((f) => ({ ...f, growMedium: customMediumInput.trim() })); setCustomMediumOpen(false); } } }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomMediumOpen(false)}>Cancelar</Button>
            <Button disabled={!customMediumInput.trim()} onClick={() => { setForm((f) => ({ ...f, growMedium: customMediumInput.trim() })); setCustomMediumOpen(false); }}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
