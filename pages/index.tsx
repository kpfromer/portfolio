import Header from '@components/Header';
import Page from '@components/Page';
import Preview from '@components/Blog/Preview';
import Img from 'next/image';
import NextLink from 'next/link';
import type { GetStaticProps } from 'next';
import { BlogPostFrontmatter, getAllBlogPostsFrontmatter } from '@lib/blog';
import Container from '@components/Container';
import SocialLinks from '@components/SocialLinks';
import { baseMdxComponents } from '@utils/mdx';
import hydrate from 'next-mdx-remote/hydrate';
import { ExperienceData, getExperience } from '@lib/experience';
import ContactForm from '@components/ContactForm';
import info from '@configs/info';
import { HTMLAttributes } from 'react';
import { getProjects, ProjectData } from '@lib/projects';
import Project from '@components/Project';
import CustomImg from '@components/Img';
import { generatePlaceholder, ImgPlaceholder } from '@lib/placeholder';

const Heading: React.FC<
  HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
> = ({ as: Type = 'h1', ...props }) => <Type {...props} className="text-5xl font-bold my-8" />;

const Seperator = () => (
  <div className="flex flex-grow" role="separator">
    <div className="my-auto flex-grow h-0.5 bg-gray-700 dark:gray-200" />
  </div>
);

const images = {
  me: '/assets/kyle-pfromer.jpg',
  background: '/assets/crested-butte-2016-07-14.jpg',
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = await Promise.all(
    (await getAllBlogPostsFrontmatter('des')).map(async (post) => ({
      ...post,
      coverImagePlaceholder: await generatePlaceholder(post.coverImage.src),
    })),
  );
  const experience = await getExperience();
  const projects = await getProjects();

  return {
    props: {
      placeholders: {
        me: await generatePlaceholder(images.me),
        background: await generatePlaceholder(images.background),
      },

      posts,
      experience,
      projects,
    } as HomeProps,
  };
};

export interface HomeProps {
  placeholders: {
    me: ImgPlaceholder;
    background: ImgPlaceholder;
  };

  posts: (BlogPostFrontmatter & { coverImagePlaceholder: ImgPlaceholder })[];
  experience: ExperienceData;
  projects: ProjectData[];
}

const Home: React.FC<HomeProps> = ({ placeholders, posts, experience, projects }) => {
  return (
    <Page title="Home" description="Learn more about me.">
      <div className="relative flex h-screen" style={{ zIndex: 1 }}>
        <div className="absolute top-0 left-0 right-0 bottom-0" style={{ zIndex: -1 }} id="top">
          <CustomImg
            src={images.background}
            placeholder={placeholders.background}
            alt="Crested Butte Mountains"
            layout="fill"
            quality={60}
            objectPosition="50% 50%"
            objectFit="cover"
            // priority
            containerProps={{
              id: 'top',
              className: 'w-full h-full',
              // className: 'absolute top-0 left-0 right-0 bottom-0',
              style: { zIndex: -1 },
            }}
          />
        </div>

        <div
          className="absolute top-0 left-0 right-0 bottom-0"
          style={{ zIndex: -1, backgroundColor: '#000000aa' }}
        />

        <div className="m-auto pt-12">
          <div className="space-y-4 text-center flex flex-col justify-center items-center">
            <div className="overflow-hidden rounded-full" style={{ height: 200, width: 200 }}>
              {/* <Img
                src="/assets/kyle-pfromer.jpg"
                alt="Kyle Pfromer"
                layout="fixed"
                width={200}
                height={200}
              /> */}
              <CustomImg
                src={images.me}
                placeholder={placeholders.me}
                alt="Kyle Pfromer"
                layout="fixed"
                width={200}
                height={200}
              />
            </div>

            <h1 className="text-6xl text-primary-500 font-bold">Hi!</h1>

            <h2 className="text-5xl text-white font-bold">I'm Kyle Pfromer</h2>

            <h3 className="text-2xl text-white">
              and I'm a <span className="font-bold text-2xl">Software Engineer</span>
            </h3>

            <SocialLinks color="text-white" />
          </div>
        </div>
      </div>

      <Header />

      <Container className="mt-5">
        <Heading id="about-me">About Me</Heading>

        <p>
          Hi! My name is <span className="text-bold">Kyle Pfromer</span>. I am a full stack
          developer that works a lot with TypeScript and JavaScript (though I have experience in C++
          and Java). I am currently a computer science student at {/* TODO: rel */}
          <a href="https://www.colorado.edu/">CU Boulder</a>. When not programming I am
          snowboarding, hiking and biking.
        </p>

        <Heading id="blog">Blog Posts</Heading>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
          {posts.map((post) => (
            <NextLink href={`/blog/${post.slug}`} key={post.slug}>
              <a>
                <Preview {...post} className="h-full" />
              </a>
            </NextLink>
          ))}
        </div>

        <Heading id="experience">Experience</Heading>

        {experience.map(({ name, items }) => (
          <div key={name}>
            <div className="flex justify-center items-center my-5">
              <h1 className="mr-3 text-4xl font-bold">{name}</h1>

              <Seperator />
            </div>

            <div className="flex flex-col space-y-8">
              {items.map(({ companyName, title, location, content }) => (
                <div className="flex-grow" key={companyName}>
                  <h2 className="text-3xl text-primary-500 font-bold">{companyName}</h2>
                  <h3 className="mt-2 text-xl font-bold">
                    {title} · {location}
                  </h3>

                  {content && (
                    <div className="pt-3">
                      {hydrate(content, { components: baseMdxComponents })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <a rel="noopener" target="_blank" href={info.resume} className="my-5 btn-primary">
          View Resume
        </a>

        <Heading id="projects">Projects</Heading>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
          {projects.map((project) => (
            <Project key={project.title} {...project} className="h-full" />
          ))}
        </div>

        <Heading id="contact">Contact</Heading>
        <ContactForm />
      </Container>
    </Page>
  );
};

export default Home;
