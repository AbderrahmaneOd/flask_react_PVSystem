import UnivariateOutliersWrapper from './../charts/UnivariateOutliersWrapper'
import NaNValues from './../charts/NaNValues'
import HandleNaNValues from './../Preprocessing/HandleNaNValues'

export default function Preprocessing() {

  return (
    <div className="flex flex-col space-y-6">
      {/*<NaNValues />
      <UnivariateOutliersWrapper />*/}
      <HandleNaNValues />

    </div>
  );
}
