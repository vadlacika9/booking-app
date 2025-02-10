'use client'

import { useRouter } from "next/navigation"

export default function DeleteButton(url){

  const router = useRouter();
  return (
    <button onClick={(async () => {
      await fetch(`/api/upload`,{
        method: 'DELETE',
        body: JSON.stringify({
          url
        })
      })

      router.refresh();
    })}>
      DELETE
    </button>
  )
}