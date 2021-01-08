import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  Link,
  Stack,
  Divider,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import Header from '@components/Header';
import Page from '@components/Page';
import Preview from '@components/Blog/Preview';
import Img from 'next/image';
import NextLink from 'next/link';
import type { GetStaticProps } from 'next';
import { BlogPostData, BlogPostFrontmatter, getAllBlogPostsFrontmatter } from '@lib/blog';
import Container from '@components/Container';
import SocialLinks from '@components/SocialLinks';
import { getYaml } from '@lib/yaml';
import renderToString from 'next-mdx-remote/render-to-string';
import { baseMdxComponents } from '@utils/mdx';
import hydrate from 'next-mdx-remote/hydrate';
import { ExperienceData, getExperience } from '@lib/experience';
import ContactForm from '@components/ContactForm';
import info from '@configs/info';

const Seperator = () => {
  const bg = useColorModeValue('gray.700', 'gray.200');

  return (
    <Flex flexGrow={1} role="separator">
      <Box my="auto" flexGrow={1} height="1px" bg={bg} />
    </Flex>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllBlogPostsFrontmatter('des');
  const experience = await getExperience();

  return {
    props: {
      posts,
      experience,
    } as HomeProps,
  };
};

export interface HomeProps {
  posts: BlogPostFrontmatter[];
  experience: ExperienceData;
}

const Home: React.FC<HomeProps> = ({ posts, experience }) => {
  return (
    <Page title="Home" description="Learn more about me.">
      <Flex minH="100vh" position="relative">
        <Box position="absolute" top={0} bottom={0} left={0} right={0} zIndex={-1}>
          <Img
            src="/assets/crested-butte-2016-07-14.jpg"
            alt="Crested Butter Mountains"
            // src="/assets/2019-07-27-Collegiate-West.jpeg"
            layout="fill"
            quality={60}
            objectPosition="50% 50%"
            objectFit="cover"
            priority
            // width={5716}
            // height={3811}
          />
        </Box>

        <Box position="absolute" top={0} bottom={0} left={0} right={0} zIndex={-1} bg="#000000aa" />

        <VStack m="auto" pt={20} spacing="10px" textAlign="center">
          <Box overflow="hidden" borderRadius="100%" h={200} w={200}>
            <Img
              src="/assets/kyle-pfromer.jpg"
              alt="Kyle Pfromer"
              layout="fixed"
              width={200}
              height={200}
            />
          </Box>

          <Heading fontSize="6xl" color="primary.500">
            Hi!
          </Heading>

          <Heading fontSize="5xl" color="white">
            I'm Kyle Pfromer
            {/* <Heading as="span" fontSize="5xl" color="primary.500">
              Pfromer
            </Heading> */}
          </Heading>

          <Text fontSize="2xl" color="white">
            and I'm a{' '}
            <Text as="span" fontWeight="bold" fontSize="2xl">
              Software Engineer
            </Text>
          </Text>

          <SocialLinks color="white" />
        </VStack>
      </Flex>

      <Header />

      <Container mt={5}>
        <Heading variant="section-title">About Me</Heading>

        <Text>
          Hi! My name is{' '}
          <Text as="span" fontWeight="bold">
            Kyle Pfromer
          </Text>
          . I am a full stack developer that works a lot with TypeScript and JavaScript (though I
          have experience in C++ and Java). I am currently a computer science student at{' '}
          <Link href="https://www.colorado.edu/" isExternal>
            CU Boulder
          </Link>
          . When not programming I am snowboarding, hiking and biking.
        </Text>

        <Heading variant="section-title">Blog Posts</Heading>

        <SimpleGrid columns={[1, 2, 3]} spacing={10}>
          {posts.map(({ slug, title, created, coverImage }) => (
            <NextLink href={`/blog/${slug}`} passHref key={slug}>
              <Box as="a">
                <Preview title={title} created={created} coverImage={coverImage} h="100%" />
              </Box>
            </NextLink>
          ))}
        </SimpleGrid>

        <Heading variant="section-title">Experience</Heading>

        {experience.map(({ name, items }) => (
          <Box key={name}>
            <Flex justifyContent="center" alignItems="center" my={5}>
              <Heading mr={3} fontSize="4xl">
                {name}
              </Heading>

              <Seperator />
            </Flex>

            <Stack spacing="15px">
              {items.map(({ companyName, title, location, content }) => (
                <Box key={companyName} flexGrow={1}>
                  <Heading fontSize="3xl" color="primary.500">
                    {companyName}
                  </Heading>
                  <Heading mt={2} fontSize="xl">
                    {title} · {location}
                  </Heading>

                  {content && (
                    <Box pt={3}>{hydrate(content, { components: baseMdxComponents })}</Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        ))}

        <Button
          as="a"
          rel="noopener"
          target="_blank"
          href={info.resume}
          colorScheme="primary"
          mt={5}
        >
          View Resume
        </Button>

        <Heading variant="section-title">Contact</Heading>

        {/* TODO: */}
        {/* <ContactForm /> */}
      </Container>
    </Page>
  );
};

export default Home;
