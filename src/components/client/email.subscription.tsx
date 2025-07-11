import RecruiterSubscription from './card/recruiter.subscription';
import SkillSubscription from './card/skill.subscription';

const EmailSubscription = () => {
    return (
        <>
            <SkillSubscription />
            <RecruiterSubscription />
        </>
    );
};

export default EmailSubscription;
