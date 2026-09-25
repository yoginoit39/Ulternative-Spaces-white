import type { Metadata } from 'next';
import ArchiveClient from './ArchiveClient';

export const metadata: Metadata = {
  title: 'Street Elevation — Ulternative Spaces',
  description:
    'Every building Ulternative Spaces has designed and built, drawn side by side on one street elevation. Kampala and Juba, 2018 to today.',
};

export default function WorkIndexPage() {
  return <ArchiveClient />;
}
