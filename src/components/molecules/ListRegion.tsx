import { useEffect, useState } from "react";
import type { RegionResponse } from "@/lib/types";
import { fetchAllRegion } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toTitleCase } from "@/lib/utils";

export default function ListRegion() {
  const [data, setData] = useState<RegionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const response = await fetchAllRegion(
          localStorage.getItem("token") || ""
        );
        if (response.code === 200) {
          setData(response);
        } else if (response.code === 403) {
          console.error("Forbidden to fetch all region.");
          localStorage.clear();
          navigate("/");
        }
      } catch (err) {
        console.error("An error occurred while fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegion();
  }, []);

  if (isLoading) return <p className="text-gray-500">Loading region data...</p>;

  return (
    <div className="space-y-4 pt-4">
      {data?.provinsi.map((prov) => (
        <div key={prov.id}>
          <h3 className="text-2xl">{prov.provinsi}</h3>
          <div className="ml-4 space-y-2">
            {data.kabupaten
              .filter((kab) => kab.prov_id === prov.id)
              .map((kab) => (
                <div key={kab.id}>
                  <h3 className="text-xl mt-2">{kab.kabupaten}</h3>
                  <div className="ml-4 space-y-1">
                    {data.kecamatan
                      .filter((kec) => kec.kab_id === kab.id)
                      .map((kec) => (
                        <div key={kec.id}>
                          <p className="text-lg">
                            {toTitleCase(kec.kecamatan)}
                          </p>
                          <div className="ml-4 space-y-1">
                            {data.desa
                              .filter((d) => d.kec_id === kec.id)
                              .map((d) => (
                                <div key={d.id}>
                                  <p className="text-md">{d.desa}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
