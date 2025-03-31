import { getFingerprint } from '@thumbmarkjs/thumbmarkjs'
import { useEffect, useState } from 'react'

export const FingerPrint = () => {

    const [FingerPrint, SetFingerPrint] = useState<string | null>(null);
    
    useEffect(() => {
        getFingerprint().then((fingerprint) => {
          SetFingerPrint(fingerprint);
        })
      }, []);
    

  return (
    <div>
        {FingerPrint}
    </div>
  )
}

export default FingerPrint