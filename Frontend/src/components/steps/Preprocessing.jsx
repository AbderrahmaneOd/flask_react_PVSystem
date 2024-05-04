import HandleNaNValues from './../scripts/HandleNaNValues'
import MissingRowsTable from '../scripts/MissingRowsTable'
import DataNormalization from '../scripts/DataNormalization'
import DataEncoding from '../scripts/DataEncoding'
import UnivariateOutliers from '../scripts/UnivariateOutliersHandler'
import DataReduction from '../scripts/DataReduction'
import DataFiltering from '../scripts/DataFiltering'

export default function Preprocessing() {

  return (
    <div className="flex flex-col space-y-6">
      <HandleNaNValues />
      <MissingRowsTable />
      <UnivariateOutliers />
      <DataNormalization />
      <DataEncoding />
      <DataReduction />
      <DataFiltering />
    </div>
  );
}
