import { cache } from 'react'
import { notFound } from 'next/navigation'

import { Container } from '~/components/Container'
import EpisodeClient from '~/components/EpisodeClient'
import { Podcast } from '~/types/podcast' // Assuming this is where your type is defined

const getEpisode = cache(async (id: string): Promise<Podcast | undefined> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/podcasts`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch episodes')
  }

  const allEpisodes: Podcast[] = await res.json()
  const episode = allEpisodes.find((episode) => episode.id.toString() === id)

  if (!episode) {
    notFound()
  }

  return episode
})

export async function generateMetadata({
  params,
}: {
  params: { episode: string }
}) {
  let episode = await getEpisode(params.episode)

  if (!episode) {
    return {
      title: 'Episode Not Found',
    }
  }

  return {
    title: episode.title,
  }
}

export default async function EpisodePage({
  params,
}: {
  params: { episode: string }
}) {
  const episode = await getEpisode(params.episode)

  if (!episode) {
    notFound()
  }

  return <EpisodeClient episode={episode} />
}
