import { View, Text, Image } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions'
import { images } from '../../assets/images'
import BoldText from '../../components/BoldText'
import colors from '../../assets/colors'
import LineBreak from '../../components/LineBreak'
import NormalText from '../../components/NormalText'

const ZacharyBio = () => {
  return (
    <Container padding={2}>
      <Header showRightIcon={false} containerPadding={0.01} padding={0.01} />
      <LineBreak val={3} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
        <Image source={images.president} style={{ height: responsiveHeight(18), width: responsiveWidth(33.5), borderRadius: responsiveHeight(0.2) }} />
        <View style={{ gap: responsiveHeight(1) }}>
          <BoldText width={55} size={1.8} color={colors.settings} title="“I have no private purpose to accomplish, no party objectives to build up, no enemies to punish -nothing to serve but my country.”" />
          <View style={{}}>
            <BoldText width={50} size={1.9} color={colors.settings} title="– President Zachary Taylor" />
          </View>
        </View>
      </View>
      <View style={{ gap: responsiveHeight(2), marginTop: responsiveHeight(2.5) }}>
        <NormalText color={colors.theme} title="This biography for President Zachary Taylor is courtesy of the White House Historical Association." />
        <NormalText color={colors.theme} title="Zachary Taylor, a general and national hero in the United States Army from the time of the Mexican-American War and the War of 1812, was elected the 12th U.S. President, serving from March 1849 until his death in July 1850." />
        <NormalText color={colors.theme} title="Northerners and Southerners disputed sharply whether the territories wrested from Mexico should be opened to slavery, and some Southerners even threatened secession. Standing firm, Zachary Taylor was prepared to hold the Union together by armed force rather than by compromise." />
        <NormalText color={colors.theme} title="Born in Virginia in 1784, he was taken as an infant to Kentucky and raised on a plantation. He was a career officer in the Army, but his talk was most often of cotton raising. His home was in Baton Rouge, Louisiana, and he owned a plantation in Mississippi." />
        <NormalText color={colors.theme} title="But Taylor did not defend slavery or southern sectionalism; 40 years in the Army made him a strong nationalist." />
        <NormalText color={colors.theme} title="He spent a quarter of a century policing the frontiers against Indians. In the Mexican War he won major victories at Monterrey and Buena Vista." />
        <NormalText color={colors.theme} title="President Polk, disturbed by General Taylor’s informal habits of command and perhaps his Whiggery as well, kept him in northern Mexico and sent an expedition under Gen. Winfield Scott to capture Mexico City. Taylor, incensed, thought that “the battle of Buena Vista opened the road to the city of Mexico and the halls of Montezuma, that others might revel in them.”" />
        <NormalText color={colors.theme} title="“Old Rough and Ready’s” homespun ways were political assets. His long military record would appeal to northerners; his ownership of 100 slaves would lure southern votes. He had not committed himself on troublesome issues. The Whigs nominated him to run against the Democratic candidate, Lewis Cass, who favored letting the residents of territories decide for themselves whether they wanted slavery." />
        <NormalText color={colors.theme} title="In protest against Taylor the slaveholder and Cass the advocate of “squatter sovereignty,” northerners who opposed extension of slavery into territories formed a Free Soil Party and nominated Martin Van Buren. In a close election, the Free Soilers pulled enough votes away from Cass to elect Taylor." />
        <NormalText color={colors.theme} title="Although Taylor had subscribed to Whig principles of legislative leadership, he was not inclined to be a puppet of Whig leaders in Congress. He acted at times as though he were above parties and politics. As disheveled as always, Taylor tried to run his administration in the same rule-of-thumb fashion with which he had fought Indians." />
        <NormalText color={colors.theme} title="Traditionally, people could decide whether they wanted slavery when they drew up new state constitutions. Therefore, to end the dispute over slavery in new areas, Taylor urged settlers in New Mexico and California to draft constitutions and apply for statehood, bypassing the territorial stage." />
        <NormalText color={colors.theme} title="Southerners were furious, since neither state constitution was likely to permit slavery; Members of Congress were dismayed, since they felt the President was usurping their policy-making prerogatives. In addition, Taylor’s solution ignored several acute side issues: the northern dislike of the slave market operating in the District of Columbia; and the southern demands for a more stringent fugitive slave law." />
        <NormalText color={colors.theme} title="In February 1850 President Taylor had held a stormy conference with southern leaders who threatened secession. He told them that if necessary to enforce the laws, he personally would lead the Army. Persons “taken in rebellion against the Union, he would hang … with less reluctance than he had hanged deserters and spies in Mexico.” He never wavered." />
        <NormalText color={colors.theme} title="Then events took an unexpected turn. After participating in ceremonies at the Washington Monument on a blistering July 4, Taylor fell ill; within five days he was dead. After his death, the forces of compromise triumphed, but the war Taylor had been willing to face came 11 years later. In it, his only son Richard served as a general in the Confederate Army." />
      </View>

    </Container>
  )
}

export default ZacharyBio