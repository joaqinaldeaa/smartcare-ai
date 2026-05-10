/**
 * SmartCareAI v2 — 20-Question Scoring Engine
 * DSM-5-aligned behavioral assessment instrument
 */

export interface Question {
  id: number;
  domain: 'A' | 'B' | 'C' | 'D';
  text: Record<string, string>; // { id, en, ms, th, vi, fil }
  options: readonly string[];     // ['Never', 'Rarely', 'Sometimes', 'Often']
  points: readonly number[];     // [0, 1, 2, 3]
}

/** Answer value → label */
export const ANSWER_LABELS = ['Never', 'Rarely', 'Sometimes', 'Often'] as const;

export const QUESTIONS: Question[] = [
  // ─── Domain A — Attention & Organization (Q1-6) ────────────────────────────
  {
    id: 1,
    domain: 'A',
    text: {
      id: 'Bagaimana ketidaktelitian anak dalam memperhatikan perincian atau membuat kesilapan cuai?',
      en: 'How often does the child fail to pay close attention to details or make careless mistakes?',
      ms: 'Bagaimana kekerapan anak gagal memberikan perhatian sepenuhnya pada butiran atau membuat kesilapan cuai?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กไม่สามารถให้ความสนใจกับรายละเอียดหรือทำผิดพลาดโดยไม่ระวัง?',
      vi: 'Trẻ không chú ý đến chi tiết hoặc mắc lỗi do vội vàng bao nhiêu lần?',
      fil: 'Gaano kadalasang nabibigong pansin ng bata ang mga maliliit na detalye o gumagawa ng mga pagkakamaling di-nakasanayan?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 2,
    domain: 'A',
    text: {
      id: 'Bagaimana kekerapan anak menghadapi masalah mengekalkan perhatian semasa tugasan atau permainan?',
      en: 'How often does the child have trouble sustaining attention during tasks or games?',
      ms: 'Bagaimana kekerapan anak menghadapi masalah mengekalkan tumpuan semasa tugasan atau permainan?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กมีปัญหาในการคงสมาธิในระหว่างทำกิจกรรมหรือเล่นเกม?',
      vi: 'Trẻ gặp khó khăn trong việc duy trì sự tập trung khi làm nhiệm vụ hoặc chơi bao nhiêu lần?',
      fil: 'Gaano kadalasang nahihirapan ang bata na panatilihin ang pagtutok sa mga gawain o laro?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 3,
    domain: 'A',
    text: {
      id: 'Bagaimana kekerapan anak tidak menghiraukan apabila seseorang bercakap dengannya?',
      en: 'How often does the child not seem to listen when spoken to?',
      ms: 'Bagaimana kekerapan anak tidak kelihatan mendengar apabila diajak bercakap?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กดูเหมือนไม่ฟังเมื่อมีคนพูดกับเขา?',
      vi: 'Trẻ có vẻ như không lắng nghe khi ai đó nói chuyện với trẻ bao nhiêu lần?',
      fil: 'Gaano kadalasang tila hindi nakikinig ang bata kapag kinakausap siya?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 4,
    domain: 'A',
    text: {
      id: 'Bagaimana kekerapan anak tidak mengikuti Arahan dan gagal menyelesaikan tugasan?',
      en: 'How often does the child not follow through on instructions and fail to finish tasks?',
      ms: 'Bagaimana kekerapan anak tidak mengikuti Arahan dan gagal menyiapkan tugasan?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กไม่ทำตามคำสั่งและไม่สามารถทำงานให้เสร็จ?',
      vi: 'Trẻ không tuân theo hướng dẫn và không hoàn thành nhiệm vụ bao nhiêu lần?',
      fil: 'Gaano kadalasang hindi sinusunod ng bata ang mga tagubilin at hindi natatapos ang mga gawain?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 5,
    domain: 'A',
    text: {
      id: 'Bagaimana kekerapan anak menghadapi masalah mengorganisasi tugasan dan barangan?',
      en: 'How often does the child have difficulty organizing tasks and belongings?',
      ms: 'Bagaimana kekerapan anak menghadapi masalah menyusun tugasan dan barang?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กมีปัญหาในการจัดระเบียบงานและของใช้?',
      vi: 'Trẻ gặp khó khăn trong việc sắp xếp công việc và đồ đạc bao nhiêu lần?',
      fil: 'Gaano kadalasang nahihirapan ang bata na ayusin ang mga gawain at gamit?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 6,
    domain: 'A',
    text: {
      id: 'Bagaimana kekerapan anak mengelak daripada tugasan yang memerlukan usaha mental yang berterusan?',
      en: 'How often does the child avoid tasks requiring sustained mental effort?',
      ms: 'Bagaimana kekerapan anak mengelak daripada tugasan yang memerlukan usaha mental yang berterusan?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กหลีกเลี่ยงงานที่ต้องใช้ความพยายามทางจิตใจอย่างต่อเนื่อง?',
      vi: 'Trẻ tránh né các nhiệm vụ đòi hỏi nỗ lực tinh thần liên tục bao nhiêu lần?',
      fil: 'Gaano kadalasang umiiwas ang bata sa mga gawain na nangangailangan ng patuloy na mental na pagpapahalaga?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },

  // ─── Domain B — Hyperactivity & Impulsivity (Q7-13) ───────────────────────
  {
    id: 7,
    domain: 'B',
    text: {
      id: 'Bagaimana kekerapan anak gelisah atau memutar badan di dalam kerusi?',
      en: 'How often does the child fidget or squirm in seat?',
      ms: 'Bagaimana kekerapan anak gelisah atau memutar badan di dalam kerusi?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กขยับหรือบิดตัวอยู่ในที่นั่ง?',
      vi: 'Trẻ bồn chồn hoặc quằn quại khi ngồi bao nhiêu lần?',
      fil: 'Gaano kadalasang nagkakagalaw o yumuyuko sa upuan ang bata?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 8,
    domain: 'B',
    text: {
      id: 'Bagaimana kekerapan anak meninggalkan kerusi apabila dijangka tinggal di situ?',
      en: 'How often does the child leave their seat when expected to stay seated?',
      ms: 'Bagaimana kekerapan anak meninggalkan tempat duduk apabila dijangka tinggal di situ?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กลุกออกจากที่นั่งทั้งที่คาดว่าควรนั่งอยู่?',
      vi: 'Trẻ rời khỏi chỗ ngồi khi được yêu cầu ngồi yên bao nhiêu lần?',
      fil: 'Gaano kadalasang umalis sa upuan ang bata kapag dapat sanang nakaupo?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 9,
    domain: 'B',
    text: {
      id: 'Bagaimana kekerapan anak berlari atau memanjat secara berlebihan dalam situasi yang tidak sesuai?',
      en: 'How often does the child run or climb excessively in inappropriate situations?',
      ms: 'Bagaimana kekerapan anak berlari atau memanjat secara berlebihan dalam situasi yang tidak sesuai?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กวิ่งหรือปีนอย่างมากในสถานการณ์ที่ไม่เหมาะสม?',
      vi: 'Trẻ chạy hoặc leo trèo quá mức trong những tình huống không phù hợp bao nhiêu lần?',
      fil: 'Gaano kadalasang tumatakbo o umaakyat nang labis sa Hindi angkop na mga sitwasyon ang bata?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 10,
    domain: 'B',
    text: {
      id: 'Bagaimana kekerapan anak menghadapi masalah bermain dengan senyap?',
      en: 'How often does the child have trouble playing quietly?',
      ms: 'Bagaimana kekerapan anak menghadapi masalah bermain dengan senyap?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กมีปัญหาในการเล่นอย่างเงียบ?',
      vi: 'Trẻ gặp khó khăn khi chơi một cách yên tĩnh bao nhiêu lần?',
      fil: 'Gaano kadalasang nahihirapan ang bata na maglaro nang tahimik?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 11,
    domain: 'B',
    text: {
      id: 'Bagaimana kekerapan anak menjawab secara automatik sebelum sesuatu soalan selesai ditanya?',
      en: 'How often does the child blurt out answers before questions are finished?',
      ms: 'Bagaimana kekerapan anak menjawab secara automatik sebelum soalan selesai ditanya?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กตอบโดยไม่ kịp suy nghĩ trước khi câu hỏi được đặt ra đủ?',
      vi: 'Trẻ trả lời vội vàng trước khi câu hỏi được đặt ra đủ bao nhiêu lần?',
      fil: 'Gaano kadalasang napopuna ng bata ang sagot bago matapos ang mga katanungan?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 12,
    domain: 'B',
    text: {
      id: 'Bagaimana kekerapan anak menghadapi masalah menunggu giliran?',
      en: 'How often does the child have difficulty waiting their turn?',
      ms: 'Bagaimana kekerapan anak menghadapi masalah menunggu giliran?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กมีปัญหาในการรอคิวของตัวเอง?',
      vi: 'Trẻ gặp khó khăn khi chờ đến lượt bao nhiêu lần?',
      fil: 'Gaano kadalasang nahihirapan ang bata na maghintay ng kanyang turn?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 13,
    domain: 'B',
    text: {
      id: 'Bagaimana kekerapan anak mengganggu atau mencampuri urusan orang lain?',
      en: 'How often does the child interrupt or intrude on others?',
      ms: 'Bagaimana kekerapan anak mengganggu atau mencampuri urusan orang lain?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กขัดจังหวะหรือ intrusion on ผู้อื่น?',
      vi: 'Trẻ ngắt lời hoặc xâm phạm người khác bao nhiêu lần?',
      fil: 'Gaano kadalasang nanghihimasok o nakikipag-interrupt ang bata sa iba?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },

  // ─── Domain C — Social Communication & Sensory (Q14-19) ───────────────────
  {
    id: 14,
    domain: 'C',
    text: {
      id: 'Bagaimana kekerapan anak menghadapi masalah membuat atau mengekalkan kontak mata semasa perbualan?',
      en: 'How often does the child have difficulty making or maintaining eye contact during conversations?',
      ms: 'Bagaimana kekerapan anak menghadapi masalah membuat atau mengekalkan sentuhan mata semasa perbualan?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กมีปัญหาในการสร้างหรือรักษาการสบตาในระหว่างสนทนา?',
      vi: 'Trẻ gặp khó khăn trong việc thiết lập hoặc duy trì giao tiếp bằng mắt khi trò chuyện bao nhiêu lần?',
      fil: 'Gaano kadalasang nahihirapan ang bata na magtaguyod o mapanatili ang contact sa mata habang nag-uusap?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 15,
    domain: 'C',
    text: {
      id: 'Bagaimana kekerapan anak lebih suka bermain bersendirian berbanding dengan kanak-kanak lain?',
      en: 'How often does the child prefer to play alone rather than with other children?',
      ms: 'Bagaimana kekerapan anak lebih suka bermain bersendirian berbanding dengan kanak-kanak lain?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กชอบเล่นคนเดียวมากกว่าเล่นกับเด็กคนอื่น?',
      vi: 'Trẻ thích chơi một mình hơn là chơi với những trẻ khác bao nhiêu lần?',
      fil: 'Gaano kadalasang mas gusto ng bata na maglaro mag-isa kaysa kasama ang ibang mga bata?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 16,
    domain: 'C',
    text: {
      id: 'Bagaimana kekerapan anak menghadapi masalah memahami atau bertindak balas terhadap emosi atau isyarat sosial orang lain?',
      en: "How often does the child have trouble understanding or responding to other people's emotions or social cues?",
      ms: 'Bagaimana kekerapan anak menghadapi masalah memahami atau bertindak balas terhadap emosi atau isyarat sosial orang lain?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กมีปัญหาในการเข้าใจหรือตอบสนองต่ออารมณ์หรือสัญญาณทางสังคมของผู้อื่น?',
      vi: 'Trẻ gặp khó khăn trong việc hiểu hoặc đáp ứng cảm xúc và tín hiệu xã hội của người khác bao nhiêu lần?',
      fil: 'Gaano kadalasang nahihirapan ang bata na maunawaan o tumugon sa mga emosyon o social cues ng ibang tao?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 17,
    domain: 'C',
    text: {
      id: 'Bagaimana kekerapan anak melakukan gerakan berulang atau menggunakan frasa berulang?',
      en: 'How often does the child engage in repetitive movements or use repetitive phrases?',
      ms: 'Bagaimana kekerapan anak melakukan pergerakan berulang atau menggunakan frasa berulang?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กทำการเคลื่อนไหวซ้ำๆ หรือใช้วลีซ้ำๆ?',
      vi: 'Trẻ có những chuyển động lặp lại hoặc sử dụng cụm từ lặp lại bao nhiêu lần?',
      fil: 'Gaano kadalasang gumagawa ng paulit-ulit na paggalaw o gumagamit ng paulit-ulit na mga parirala ang bata?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 18,
    domain: 'C',
    text: {
      id: 'Bagaimana kekerapan anak berdegil pada rutin dan marah dengan perubahan?',
      en: 'How often does the child insist on sameness in routines and get upset with changes?',
      ms: 'Bagaimana kekerapan anak menegaskan kesamaan dalam rutin dan marah dengan perubahan?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กยืนยันความเหมือนในกิจวัตรและโกรธเมื่อมีการเปลี่ยนแปลง?',
      vi: 'Trẻ khăng khăng đòi mọi thứ phải theo thói quen và nổi giận khi có thay đổi bao nhiêu lần?',
      fil: 'Gaano kadalasang nagtataguyod ng pagkakapareho sa mga routine at nagkakagalaw kapag may mga pagbabago?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
  {
    id: 19,
    domain: 'C',
    text: {
      id: 'Bagaimana kekerapan anak menunjukkan tindak balas yang luar biasa terhadap pengalaman deria (bunyi, tekstur, cahaya)?',
      en: 'How often does the child show unusual reactions to sensory experiences (noises, textures, lights)?',
      ms: 'Bagaimana kekerapan anak menunjukkan tindak balas yang luar biasa terhadap pengalaman deria (bunyi, tekstur, cahaya)?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กแสดงปฏิกิริยาผิดปกติต่อประสบการณ์ทางประสาทสัมผัส (เสียง พื้นผิว แสง)?',
      vi: 'Trẻ có những phản ứng bất thường với các trải nghiệm giác quan (tiếng ồn, kết cấu, ánh sáng) bao nhiêu lần?',
      fil: 'Gaano kadalasang nagpapakita ng Hindi pangkaraniwang reaksyon sa mga sensory na karanasan (ingay, textures, liwanag)?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },

  // ─── Domain D — General Development (Q20) ──────────────────────────────────
  {
    id: 20,
    domain: 'D',
    text: {
      id: 'Bagaimana kekerapan anak menghadapi masalah mempelajari kemahiran baharu atau mengingat Arahan berbanding rakan sebaya yang sama umur?',
      en: 'How often does the child struggle to learn new skills or remember instructions compared to peers of the same age?',
      ms: 'Bagaimana kekerapan anak bergelut untuk mempelajari kemahiran baharu atau mengingat Arahan berbanding rakan sebaya yang sama usia?',
      th: 'บ่อยครั้งแค่ไหนที่เด็กมีปัญหาในการเรียนรู้ทักษะใหม่หรือจำคำสั่งเมื่อเทียบกับเพื่อนรุ่นเดียวกัน?',
      vi: 'Trẻ gặp khó khăn trong việc học kỹ năng mới hoặc ghi nhớ hướng dẫn so với các bạn cùng trang lứa bao nhiêu lần?',
      fil: 'Gaano kadalasang nahihirapan ang bata na matutuhan ang mga bagong kasanayan o tandaan ang mga tagubilin kumpara sa mga kapwa edad nila?',
    },
    options: ANSWER_LABELS,
    points: [0, 1, 2, 3],
  },
];