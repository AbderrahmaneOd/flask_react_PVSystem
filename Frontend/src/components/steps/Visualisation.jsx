import DynamiqueTime from "../charts/DynamiqueTime"
import DynamiqueIrradiance from "../charts/DynamiqueIrradiance"
import TimeTech from "../charts/TimeTech"
import MaintenanceFreq from "../charts/MaintenanceFreq"
import TemperaturePowerDynamic from "../charts/TemperaturePowerDynamic"
import ManifPowerTime from "../charts/ManifPowerTime"

export default function Visualisation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
      <DynamiqueTime />
      <DynamiqueIrradiance />
      <TimeTech />
      <MaintenanceFreq />
      <ManifPowerTime />
      <TemperaturePowerDynamic />
    </div>
  );
}
