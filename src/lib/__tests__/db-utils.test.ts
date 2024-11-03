import {
  addPodcast,
  getAllPodcasts,
  getPodcastById,
  updatePodcast,
  deletePodcast,
} from '../db-utils'
import db from '../db'
import { jest, beforeEach, describe, test, expect } from '@jest/globals'
import { RunResult } from 'better-sqlite3' // Missing import for RunResult

jest.mock('../db')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Podcast DB Utilities', () => {
  const mockPodcast = {
    title: 'Test Podcast',
    description: 'A test podcast',
    author: 'Test Author',
    published_date: '2023-10-10',
    cover_image_url: 'http://example.com/image.jpg',
  }

  test('addPodcast adds a new podcast', () => {
    const runMock = jest.fn()
    const mockStatement = { run: runMock }
    db.prepare = jest
      .fn()
      .mockReturnValueOnce(mockStatement) as unknown as typeof db.prepare;

    addPodcast(mockPodcast)

    expect(runMock).toHaveBeenCalledWith(
      mockPodcast.title,
      mockPodcast.description,
      mockPodcast.author,
      mockPodcast.published_date,
      mockPodcast.cover_image_url,
    )
  })

  test('getAllPodcasts fetches all podcasts', () => {
    const allMock = jest.fn().mockReturnValue([mockPodcast])
    db.prepare = jest
      .fn()
      .mockReturnValue({ all: allMock }) as unknown as typeof db.prepare

    const podcasts = getAllPodcasts()

    expect(allMock).toHaveBeenCalled()
    expect(podcasts).toEqual([mockPodcast])
  })

  test('getPodcastById fetches a podcast by ID', () => {
    const getMock = jest.fn().mockReturnValue({ ...mockPodcast, id: 1 })
    db.prepare = jest
      .fn()
      .mockReturnValueOnce({ get: getMock }) as unknown as typeof db.prepare

    const podcast = getPodcastById(1)

    expect(getMock).toHaveBeenCalledWith(1)
    expect(podcast).toEqual({ ...mockPodcast, id: 1 })
  })

  test('updatePodcast updates a podcast', () => {
    const runMock = jest.fn()
    db.prepare = jest
      .fn()
      .mockReturnValueOnce({ run: runMock }) as unknown as typeof db.prepare

    updatePodcast(1, mockPodcast)

    expect(runMock).toHaveBeenCalledWith(
      mockPodcast.title,
      mockPodcast.description,
      mockPodcast.author,
      mockPodcast.published_date,
      mockPodcast.cover_image_url,
      1,
    )
  })

  test('deletePodcast deletes a podcast by ID', () => {
    const runMock = jest.fn().mockReturnValue({} as RunResult)
    db.prepare = jest
      .fn()
      .mockReturnValueOnce({ run: runMock }) as unknown as typeof db.prepare

    deletePodcast(1)

    expect(runMock).toHaveBeenCalledWith(1)
  })
})
