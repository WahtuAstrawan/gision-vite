const Legend = () => {
  return (
    <>
      <div className="absolute top-4 right-4 bg-white p-3 rounded shadow z-[1000] text-sm">
        <div className="flex items-center mb-1">
          <span className="w-4 h-4 bg-blue-600 mr-2 inline-block"></span>
          Jalan Provinsi
        </div>
        <div className="flex items-center mb-1">
          <span className="w-4 h-4 bg-red-500 mr-2 inline-block"></span>
          Jalan Kabupaten
        </div>
        <div className="flex items-center mb-1">
          <span className="w-4 h-4 bg-green-600 mr-2 inline-block"></span>
          Jalan Desa
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-yellow-300 mr-2 inline-block"></span>
          Jalan Dipilih
        </div>
        <div className="flex gap-2 items-center pt-4">
          <div className="w-[40px] h-[10px] bg-black rounded-lg"> </div>
          <div className="text-md"> Baik</div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex">
            <div className="w-[20px] h-[10px] bg-black rounded-lg"> </div>
            <div className="w-[20px] h-[10px] bg-black rounded-lg"> </div>
          </div>
          <div className="text-md"> Sedang</div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex">
            <div className="w-[10px] h-[10px] bg-black rounded-lg"> </div>
            <div className="w-[10px] h-[10px] bg-black rounded-lg"> </div>
            <div className="w-[10px] h-[10px] bg-black rounded-lg"> </div>
            <div className="w-[10px] h-[10px] bg-black rounded-lg"> </div>
          </div>
          <div className="text-md"> Rusak</div>
        </div>
      </div>
    </>
  );
};

export default Legend;
