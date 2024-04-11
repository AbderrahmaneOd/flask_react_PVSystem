import UnivariateOutliers from './../charts/UnivariateOutliers'
import NaNValues from './../charts/NaNValues'

export default function Preprocessing () {

  return (
    <div className="flex flex-col ">
      <h2 className="text-xl font-semibold mb-4">Percentage of Nan values</h2>
      <NaNValues />
      <UnivariateOutliers />
    </div>
  );
}
