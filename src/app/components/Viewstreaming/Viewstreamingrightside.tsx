import Viewstreamingrightsidebtn from './Viewstreamingrightsidebtn';
import ViewstreamingrightsideAvaivlecoins from './ViewstreamingrightsideAvaivlecoins';
// Gift list removed — feature disabled
// import ViewstreamingrightsideGiftlist from './ViewstreamingrightsideGiftlist';

function Viewstreamingrightside() {
  return (
    <div className=' w-full    relative h-full'>
      <Viewstreamingrightsidebtn />
      {/* <ViewstreamingrightsideGiftlist /> */}
      <ViewstreamingrightsideAvaivlecoins/>
    </div>
  )
}

export default Viewstreamingrightside
