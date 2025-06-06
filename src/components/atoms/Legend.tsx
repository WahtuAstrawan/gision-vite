const Legend = () => {
  return (
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
    </div>
  );
};

export default Legend;
