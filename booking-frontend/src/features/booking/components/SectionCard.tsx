import { ReactNode } from 'react';

type SectionCardProps = {
  title: string;
  description?: string;
  loading?: boolean;
  children: ReactNode;
};

export const SectionCard = ({ title, description, loading, children }: SectionCardProps) => (
  <section className="panel">
    <h3 className="section-title">{title}</h3>
    {description ? <p className="muted">{description}</p> : null}
    {loading ? <p className="muted">Loading...</p> : children}
  </section>
);

