// src/components/EpisodeClient.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '~/components/Container'
import { EpisodePlayButton } from '~/components/EpisodePlayButton'
import { FormattedDate } from '~/components/FormattedDate'
import { VideoIcon } from '@radix-ui/react-icons'
import { type Podcast as Episode } from '~/types/podcast'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import { Plugin } from 'unified'

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

// Inline plugin to add target="_blank" and rel="noopener noreferrer" to all links
const remarkExternalLinks: Plugin = () => {
  return (tree: any) => {
    visit(tree, 'link', (node: any) => {
      if (node && typeof node === 'object' && node.type === 'link') {
        if (!node.data) node.data = {}
        if (!node.data.hProperties) node.data.hProperties = {}
        node.data.hProperties.target = '_blank'
        node.data.hProperties.rel = 'noopener noreferrer'
      }
    })
  }
}

function EpisodeEntry({ episode }: { episode: Episode }) {
  let date = episode.created_at ? new Date(episode.created_at) : new Date()

  // Convert Markdown to HTML with proper attributes for links
  const markdownContent = episode.notes || ''
  const htmlContent = remark()
    .use(remarkExternalLinks)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(markdownContent)
    .toString()

  return (
    <article
      aria-labelledby={`episode-${episode.id}-title`}
      className="py-10 sm:py-12"
    >
      <Container>
        <div className="flex flex-col items-start sm:flex-row sm:items-center">
          {episode.thumbnail_url && (
            <div className="relative mb-4 w-full sm:mb-0 sm:mr-6 sm:w-1/4">
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
                    height={320} // Updated for square aspect
                    className="aspect-square rounded-md object-cover"
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
                  height={320} // Updated for square aspect
                  className="aspect-square rounded-md object-cover"
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
            </div>
          </div>
        </div>

        <div
          className="prose mt-8 text-base leading-7 text-slate-700"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </Container>
    </article>
  )
}

export default function EpisodeClient({ episode }: { episode: Episode }) {
  if (!episode) {
    return (
      <Container>
        <p className="mt-4 text-slate-700">No episode available.</p>
      </Container>
    )
  }

  return (
    <div className="pb-12 pt-16 sm:pb-4 lg:pt-12">
      <EpisodeEntry episode={episode} />
    </div>
  )
}
