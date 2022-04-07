import Link from 'next/link'
import React from 'react'
import {IProps} from '../typings'
import {urlFor} from '../sainty'

const Posts = ({posts}: IProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
            {posts.map(post => (
                <Link key={post._id} href={`/post/${post.slug.current}`}>
                    <div className="overflow-hidden border rounded-lg group cursor-pointer">
                        <img
                            className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                            src={urlFor(post.mainImage).url()!}
                            alt="Post preview image"
                        />
                        <div className="flex justify-between p-5 bg-white">
                            <div className="tracking-tight">
                                <p className="text-lg font-bold leading-5 mb-1">{post.title}</p>
                                <p className="text-xs">
                                    <span className='text-zinc-500'>{post.description}</span>
                                    {' '}by{' '}
                                    <span className="">{post.author.name}</span>
                                </p>
                            </div>
                            <img
                                className="h-12 w-12 rounded-full border"
                                src={urlFor(post.author.image).url()}
                                alt="Author image"
                            />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Posts
