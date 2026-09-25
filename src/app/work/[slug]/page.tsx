import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProject, PROJECTS } from '@/lib/projects';
import ProjectSheet from './ProjectSheet';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.name} — Ulternative Spaces`,
    description: project.description,
  };
}

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const total = PROJECTS.length;
  const project = PROJECTS[index];
  const next = PROJECTS[(index + 1) % total];
  const prev = PROJECTS[(index - 1 + total) % total];

  return <ProjectSheet key={slug} project={project} next={next} prev={prev} index={index} total={total} />;
}
