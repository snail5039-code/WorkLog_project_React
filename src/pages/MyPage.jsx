import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 

function MyPage() {
  return (
  <div>

    <button
  class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900">
  Button
</button>
<div className="avatar">
  <div className="w-24 rounded">
    <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
  </div>
</div>
  </div>

  );

}

export default MyPage;