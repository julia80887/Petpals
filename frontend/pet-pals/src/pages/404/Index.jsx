import React, { useEffect, useState } from 'react';

function NotFound() {

  return (
    <>
    {/* NOTE: There is no css rule for this noResultFound*/}
    <div className="noResultFound">
        <h3 className="noResultHeading">Page not Found</h3>
      </div>
    </>
  );
}

export default NotFound;
