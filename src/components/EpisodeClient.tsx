import Link from 'next/link'
import Image from 'next/image'
import { Container } from '~/components/Container'
import { EpisodePlayButton } from '~/components/EpisodePlayButton'
import { FormattedDate } from '~/components/FormattedDate'
import { VideoIcon } from '@radix-ui/react-icons'
import { type Podcast as Episode } from '~/types/podcast'
import { remark } from 'remark'
import html from 'remark-html'
import { useEffect, useState } from 'react'

function PauseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.496 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H2.68a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H1.496Zm5.82 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H8.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H7.316Z"
      />
    </svg>
  )
}

function PlayIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" {...props}>
      <path d="M8.25 4.567a.5.5 0 0 1 0 .866l-7.5 4.33A.5.5 0 0 1 0 9.33V.67A.5.5 0 0 1 .75.237l7.5 4.33Z" />
    </svg>
  )
}

function EpisodeEntry({ episode }: { episode: Episode }) {
  const [htmlContent, setHtmlContent] = useState<string>('')

  useEffect(() => {
    const processMarkdown = async () => {
      if (episode.notes) {
        const processed = await remark().use(html).process(episode.notes)
        setHtmlContent(processed.toString())
      }
    }
    processMarkdown()
  }, [episode.notes])

  let date = episode.created_at ? new Date(episode.created_at) : new Date()

  return (
    <article
      aria-labelledby={`episode-${episode.id}-title`}
      className="py-10 sm:py-12"
    >
      <Container>
        <div className="flex flex-col items-start sm:flex-row sm:items-center">
          {episode.thumbnail_url && (
            <div className="relative mb-4 aspect-square w-full sm:mb-0 sm:mr-6 sm:w-1/4">
              {episode.video_url ? (
                <Link
                  href={episode.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={episode.thumbnail_url}
                    alt={`${episode.title} thumbnail`}
                    width={320}
                    height={320} // Set to match width for a square thumbnail
                    className="aspect-square rounded-md border border-gray-300 object-cover" // Change to aspect-square for a 1:1 ratio
                  />
                  <VideoIcon
                    className="absolute inset-0 h-12 w-12 text-red-500"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </Link>
              ) : (
                <Image
                  src={episode.thumbnail_url}
                  alt={`${episode.title} thumbnail`}
                  width={320}
                  height={320} // Set to match width for a square thumbnail
                  className="aspect-square rounded-md border border-gray-300 object-cover" // Change to aspect-square for a 1:1 ratio
                />
              )}
            </div>
          )}
          <div className="flex flex-col items-start">
            <h2
              id={`episode-${episode.id}-title`}
              className="mt-2 text-lg font-bold text-slate-900"
            >
              <Link href={`/${episode.id}`}>{episode.title}</Link>
            </h2>
            <FormattedDate
              date={date}
              className="order-first font-mono text-sm leading-7 text-slate-500"
            />
            <div
              className="mt-1 text-base leading-7 text-slate-700"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            <div className="mt-4 flex items-center gap-4">
              <EpisodePlayButton
                episode={episode}
                className="flex items-center gap-x-3 text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
                playing={
                  <>
                    <PauseIcon className="h-2.5 w-2.5 fill-current" />
                    <span aria-hidden="true">Listen</span>
                  </>
                }
                paused={
                  <>
                    <PlayIcon className="h-2.5 w-2.5 fill-current" />
                    <span aria-hidden="true">Listen</span>
                  </>
                }
              />
              <span
                aria-hidden="true"
                className="text-sm font-bold text-slate-400"
              >
                /
              </span>
              <Link
                href={`/${episode.id}`}
                className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
                aria-label={`Show notes for episode ${episode.title}`}
              >
                Show notes
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </article>
  )
}

export default async function Home() {
  let episodes: Episode[] = []

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/podcasts`)
    if (!res.ok) {
      throw new Error('Failed to fetch episodes')
    }
    episodes = await res.json()
  } catch (error) {
    console.error('Error fetching episodes:', error)
    // Handle error state if necessary, e.g., display a message or fallback UI
  }

  return (
    <div className="pb-12 pt-16 sm:pb-4 lg:pt-12">
      <Container>
        <h1 className="text-2xl font-bold leading-7 text-slate-900">
          Episodes
        </h1>
      </Container>
      <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
        {episodes.length > 0 ? (
          episodes.map((episode) => (
            <EpisodeEntry key={episode.id} episode={episode} />
          ))
        ) : (
          <Container>
            <p className="mt-4 text-slate-700">No episodes available.</p>
          </Container>
        )}
      </div>
    </div>
  )
}

export const revalidate = 10
