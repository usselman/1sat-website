import JsonTable from "@/components/jsonTable";
import { API_HOST } from "@/constants";
import { OrdUtxo } from "@/types/ordinals";
import * as http from "@/utils/httpClient";
import OutpointPage from ".";
import { OutpointTab } from "./tabs";

interface Props {
  outpoint: string;
}

const OutpointInscription = async ({ outpoint }: Props) => {
  const url = `${API_HOST}/api/inscriptions/${outpoint}`;
  const { promise } = http.customFetch<OrdUtxo>(url);
  const artifact = await promise;
  return (
    <OutpointPage
      outpoint={outpoint}
      activeTab={OutpointTab.Inscription}
      artifact={artifact}
      content={
        <div>
          Inscription
          <JsonTable data={artifact.origin?.data?.insc} />

          Metadata
          <JsonTable data={artifact.origin?.data?.map} />
        </div>
      }
    />
  );
};

export default OutpointInscription;
