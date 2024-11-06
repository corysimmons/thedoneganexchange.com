'use client'

import { useAudioPlayer } from '~/components/AudioProvider'
import { type Podcast } from '~/types/podcast'

export function EpisodePlayButton({
  episode,
  playing,
  paused,
  ...props
}: React.ComponentPropsWithoutRef<'button'> & {
  episode: Podcast
  playing: React.ReactNode
  paused: React.ReactNode
}) {
  let player = useAudioPlayer(episode)

  return (
    <button
      type="button"
      onClick={() => player.toggle()}
      aria-label={`${player.playing ? 'Pause' : 'Play'} episode ${
        episode.title
      }`}
      {...props}
    >
      {player.playing ? playing : paused}
    </button>
  )
}
