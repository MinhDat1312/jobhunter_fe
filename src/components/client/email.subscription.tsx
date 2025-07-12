import RecruiterSubscription from './card/recruiter.subscription';
import SkillSubscription from './card/skill.subscription';
import { motion } from 'motion/react';

const EmailSubscription = () => {
    return (
        <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <SkillSubscription />
            <RecruiterSubscription />
        </motion.div>
    );
};

export default EmailSubscription;
