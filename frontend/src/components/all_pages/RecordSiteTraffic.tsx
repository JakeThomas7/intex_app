import { getFingerprint } from "@thumbmarkjs/thumbmarkjs";
import { useEffect } from "react";
import { recordSiteTraffic } from "../../api/HeadlinesAPI";

const RecordSiteTraffic = () => {

    useEffect(() => {
        const getFingerprintAsync = async () => {
            const fingerprint = await getFingerprint();
            try{
                await recordSiteTraffic(fingerprint);
            } catch (e) {
                // console.log(e)
            }
        };
        
        getFingerprintAsync();
    }, []);

  return null
}

export default RecordSiteTraffic