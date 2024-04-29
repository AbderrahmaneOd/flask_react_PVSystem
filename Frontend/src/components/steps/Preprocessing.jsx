import HandleNaNValues from './../scripts/HandleNaNValues'
import MissingRowsTable from '../scripts/MissingRowsTable'
import DataNormalization from '../scripts/DataNormalization'
import DataEncoding from '../scripts/DataEncoding'
import UnivariateOutliers from '../scripts/UnivariateOutliersHandler'

export default function Preprocessing() {

  return (
    <div className="flex flex-col space-y-6">
      <HandleNaNValues />
      <MissingRowsTable />
      <UnivariateOutliers />
      <DataNormalization />
      <DataEncoding />
    </div>
  );
}
