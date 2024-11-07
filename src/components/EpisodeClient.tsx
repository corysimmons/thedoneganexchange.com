'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Container } from '~/components/Container'
import { EpisodePlayButton } from '~/components/EpisodePlayButton'
import { FormattedDate } from '~/components/FormattedDate'
import { PauseIcon } from '~/components/PauseIcon'
import { PlayIcon } from '~/components/PlayIcon'
import { VideoIcon } from '@radix-ui/react-icons'
import { Podcast } from '~/types/podcast'

export default function EpisodeClient({ episode }: { episode: Podcast }) {
  const router = useRouter()

  // Safely handle the date parsing, assuming 'created_at' is used as the date field
  let date: Date | null = episode.created_at
    ? new Date(episode.created_at)
    : null

  if (date && isNaN(date.getTime())) {
    date = null // If the date parsing fails, set date to null
  }

  return (
    <article className="py-16 lg:py-36">
      <Container>
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300 focus:outline-none focus:ring focus:ring-slate-400 focus:ring-offset-2"
        >
          &larr; Back
        </button>

        <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {episode.thumbnail_url && (
            <div className="relative mb-4 w-full sm:mb-0 sm:w-1/4">
              {episode.video_url ? (
                <a
                  href={episode.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={episode.thumbnail_url}
                    alt={`${episode.title} thumbnail`}
                    width={320}
                    height={180}
                    className="aspect-video rounded-md object-cover"
                  />
                  <VideoIcon
                    className="absolute inset-0 h-12 w-12 text-red-500"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </a>
              ) : (
                <Image
                  src={episode.thumbnail_url}
                  alt={`${episode.title} thumbnail`}
                  width={320}
                  height={180}
                  className="aspect-video rounded-md object-cover"
                />
              )}
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-6">
              <EpisodePlayButton
                episode={episode}
                className="group relative flex h-18 w-18 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring focus:ring-slate-700 focus:ring-offset-4"
                playing={
                  <PauseIcon className="h-9 w-9 fill-white group-active:fill-white/80" />
                }
                paused={
                  <PlayIcon className="h-9 w-9 fill-white group-active:fill-white/80" />
                }
              />
              <div className="flex flex-col">
                <h1 className="mt-2 text-4xl font-bold text-slate-900">
                  {episode.title}
                </h1>
                {date ? (
                  <FormattedDate
                    date={date}
                    className="order-first font-mono text-sm leading-7 text-slate-500"
                  />
                ) : (
                  <span className="order-first font-mono text-sm leading-7 text-slate-500">
                    No Published Date Available
                  </span>
                )}
              </div>
            </div>
            <p className="ml-24 mt-3 text-lg font-medium leading-8 text-slate-700">
              {episode.notes ?? 'No description available.'}
            </p>
          </div>
        </header>
        <hr className="my-12 border-gray-200" />
        <div
          className="prose prose-slate mt-14 [&>h2:nth-of-type(3n)]:before:bg-violet-200 [&>h2:nth-of-type(3n+2)]:before:bg-indigo-200 [&>h2]:mt-12 [&>h2]:flex [&>h2]:items-center [&>h2]:font-mono [&>h2]:text-sm [&>h2]:font-medium [&>h2]:leading-7 [&>h2]:text-slate-900 [&>h2]:before:mr-3 [&>h2]:before:h-3 [&>h2]:before:w-1.5 [&>h2]:before:rounded-r-full [&>h2]:before:bg-cyan-200 [&>ul]:mt-6 [&>ul]:list-['\2013\20'] [&>ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: episode.notes || '' }}
        />
      </Container>
    </article>
  )
}
