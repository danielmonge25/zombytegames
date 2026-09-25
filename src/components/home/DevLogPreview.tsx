import { POSTS, displayOrder } from '../../lib/devlog';
import { paths } from '../../lib/paths';
import { Link } from '../../lib/router';
import { SectionHeading } from '../ui/SectionHeading';
import { DevLogList } from '../DevLogList';

export function DevLogPreview() {
  const posts = displayOrder(POSTS).slice(0, 3);
  return (
    <section id="devlog" className="section" aria-labelledby="devlog-title" data-byte="The dev writes things down here.">
      <div className="container">
        <SectionHeading
          index="06"
          kicker="Dev log"
          title="The development journal"
          intro="Progress notes, experiments, and lessons learned while building games solo."
          id="devlog-title"
        />
        <DevLogList posts={posts} />
        <p className="section-foot" data-reveal="fade">
          <Link to={paths.devlog} className="text-link">
            All entries <span className="arrow">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
