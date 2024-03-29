import {
  PlusIcon,
  ThumbUpIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon,
} from '@heroicons/react/solid'
import MuiModal from '@mui/material/Modal'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import ReactPlayer from 'react-player/lazy'
import { useRecoilState } from 'recoil'
import { modalState, movieState } from '../atom/modalAtom'
import { Element, Genre, Movie } from '../typings'

function Modal() {
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [movie, setMovie] = useRecoilState(movieState)
  const [genres, setGenres] = useState<Genre[]>([])
  const [trailer, setTrailer] = useState('')
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)
  const [data, setData] = useState()
  const [result, setResult] = useState([])

  useEffect(() => {
    if (!movie) {
      return
    }

    async function fetchMovie() {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === 'tv' ? 'tv' : 'movie'
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      ).then((response) => response.json())

      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element: Element) => element.type === 'Trailer'
        )
        setTrailer(data.videos?.results[index]?.key)
      }
      if (data?.genres) {
        setGenres(data.genres)
      }
      setResult(data.videos.results)
      setData(data)
    }

    fetchMovie()
  }, [])

  console.log(data)
  const handleClose = () => {
    setShowModal(false)
  }
  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide "
    >
      <>
        <button
          onClick={handleClose}
          className="modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]"
        >
          <XIcon className="h-6 w-6" />
        </button>

        {result.length == 0 ? (
          <div className="relative pt-[56.25%]">
            <Image
              src={`https://image.tmdb.org/t/p/w500${
                movie?.backdrop_path || movie?.poster_path
              }`}
              className="rounded-sm object-cover md:rounded"
              layout="fill"
            />
          </div>
        ) : (
          <div className="relative pt-[56.25%]">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailer}`}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: '0', left: '0' }}
              playing={playing}
              muted={muted}
              onPause={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
            />

            <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
              <div className="flex space-x-2">
                {playing ? (
                  <button
                    className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]"
                    onClick={() => setPlaying(false)}
                  >
                    <FaPause className="h-6 w-6 text-black" />
                    Pause
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]"
                    onClick={() => setPlaying(true)}
                  >
                    <FaPlay className="h-6 w-6 text-black" />
                    Play
                  </button>
                )}

                <button className="modalButton">
                  <PlusIcon className="h-6 w-6" />
                </button>

                <button className="modalButton">
                  <ThumbUpIcon className="h-6 w-6" />
                </button>
              </div>{' '}
              <button className="modalButton" onClick={() => setMuted(!muted)}>
                {muted ? (
                  <VolumeOffIcon className="h-6 w-6" />
                ) : (
                  <VolumeUpIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        )}

        <div className="flex space-x-16 rounded-b bg-[#181818] px-10 py-8">
          <div className="space-y-6 text-lg">
            <div className="flex items-center space-x-2 text-sm">
              <p className="font-semibold text-green-400">
                {movie!.vote_average * 10}% Match
              </p>
              <p className="font-light ">
                {movie?.release_date || movie?.first_air_date}
              </p>
              <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">
                HD
              </div>
            </div>

            <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
              <p className="w-5/6">{movie?.overview}</p>
              <div className="flex flex-col space-y-3 text-sm">
                <div>
                  <span className="text-[gray]">Genres: </span>
                  {genres.map((genre) => genre.name).join(', ')}
                </div>

                <div>
                  <span className="text-[gray]">Original language: </span>
                  {movie?.original_language.toUpperCase()}
                </div>

                <div>
                  <span className="text-[gray]">Total Votes: </span>
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </MuiModal>
  )
}

export default Modal
